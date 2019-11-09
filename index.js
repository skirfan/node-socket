require('dotenv').config()
const debug = require('debug')('app:index.js')
const config = require('config')
const app = require('express')()
const server = require('createServer')(app)
const mongoose = require('mongoose')
require('express-async-errors')

const routes = require('routes')
const middleware = require('middleware')
const errorMiddleware = require('middleware/error')

const cli = require('utils/cli')
const reportErr = require('utils/reportErr')(debug)
const DB = process.env.MONGODB
const PORT = config.get('port')

const stop = async () => {
  // await mongoose.disconnect()
  if (server.address()) server.close()
}

const start = async () => {
  cli.clear()

  // const dbConnected = await new Promise(r => {
  //   mongoose
  //     .connect(DB, config.get('mongoose'))
  //     .then(() => r(true))
  //     .catch(e => r(reportErr(e)))
  // })
  // if (!dbConnected) return stop()

  try {
    app.use(middleware)
    app.use('/api/', routes)
    app.use(errorMiddleware)
    app.get('*', (req, res) => res.sendFile('index.html', { root: './public' }))
    server.listen(PORT)
  } catch (e) {
    reportErr(e)
  }
}

mongoose.connection
  .on('connected', () => debug(cli.msg.dbOn(DB)))
  .on('disconnected', () => debug(cli.msg.dbOff(DB)))

server
  .on('listening', () => debug(cli.msg.servOn(PORT)))
  .on('close', () => debug(cli.msg.servOff(PORT)))

process
  .on('SIGTERM', stop)
  .on('SIGINT', stop)
  .on('uncaughtException', reportErr)
  .on('unhandledRejection', reportErr)

start()

// throw Error('ErrorErrorError') // Uncomment to test logger
