const debug = require('debug')('app:error')
const chalk = require('chalk')
const logger = require('./winston/logger')
const r = n => '-'.repeat(n)

module.exports = (thisDebug = debug) => error => {
  logger.error('', error)
  const query = encodeURI(error.stack.split('\n')[0])
  if (!thisDebug.enabled) return false
  const msg = [
    chalk.red(r(60)),
    error,
    chalk.red(`${r(19)} Something went wrong ${r(19)}`),
    chalk.red(`${r(18)} Check logs for details ${r(18)}`),
    chalk.green(`https://stackoverflow.com/search?q=${query}`)
  ]
  msg.forEach(l => thisDebug(l))
  return false
}
