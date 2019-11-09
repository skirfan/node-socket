const debug = require('debug')('app:utils:transport')
const fs = require('fs')
const rll = require('read-last-lines')
const path = require('path')
const moment = require('moment')
const mkdirp = require('make-dir')
const Transport = require('winston-transport')
const promisified = require('utils/promisified')

class JsonTransport extends Transport {
  constructor() {
    super()
    this.filename = null
    this.nextFilename = null
    this.init()
  }

  getFileName(date = moment()) {
    const file = `${date.format('YYYY-MM-DD')}.log.json`
    const dir = file.split('-').splice(0, 2)
    const env = process.env.NODE_ENV
    return `./.logs/${env}/${dir[0]}-${dir[1]}/${file}`
  }

  init() {
    this.filename =
      this.filename !== this.nextFilename
        ? this.nextFilename
        : this.getFileName()
    this.nextFilename = this.getFileName(moment().add(1, 'days'))
  }

  deleteLastLine() {
    return new Promise(r => {
      rll.read(this.filename, 1).then(lines => {
        fs.stat(this.filename, (err, stats) => {
          if (err) return r(false)
          stats.size < 3 && (this.first = true)
          fs.truncate(
            this.filename,
            stats.size - lines.length,
            e => (e ? r(false) : r(true))
          )
        })
      })
    })
  }

  async writeLog(i) {
    try {
      if (this.filename === this.nextFilename) await this.init()
      if (Object.prototype.hasOwnProperty.call(i, 'stack'))
        i.stack = i.stack.toString().split('\n    ')

      i.timestamp = moment().format('DD/MM/YYYY hh:mm:ss A')
      const line = JSON.stringify(i)

      if (fs.existsSync(this.filename, 'utf8')) {
        await this.deleteLastLine()
        await promisified.fs.appendFile(this.filename, `,${line}\n]`, 'utf8')
      } else {
        await mkdirp(path.parse(this.filename).dir)
        await promisified.fs.writeFile(this.filename, `[\n${line}\n]`, 'utf8')
      }
    } catch (e) {
      debug(e)
    }
  }

  async log(i, cb) {
    setImmediate(() => this.emit('logged', i))
    await this.writeLog(i)
    cb()
  }
}

exports.JsonTransport = JsonTransport
