const config = require('config')
const winston = require('winston')
const logTo = config.get('logger')
const transports = []

logTo === 'json' &&
  (() => {
    const { JsonTransport } = require('./JsonTransport')
    transports.push(new JsonTransport())
  })()

logTo === 'database' &&
  (() => {
    const { MongoDB } = require('winston-mongodb')
    transports.push(new MongoDB({ db: process.env.MONGODB }))
  })()

module.exports = winston.createLogger({ transports })
