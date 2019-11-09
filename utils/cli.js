const c = require('chalk')

const tls = () => (process.env.TLS === 'true' ? c.green('TLS') : c.red('TLS'))

exports.clear = () => process.stdout.write('\u001b[2J\u001b[0;0H')
exports.breakLine = () => process.stdout.write('\n')

exports.msg = {
  dbOff: a => `${c.yellow('Database disconnected')} ${c.cyan(a)}`,
  dbOn: a => `${c.green('Database connected')} ${c.cyan(a)}`,
  servOff: a => `${c.yellow('HTTP server closed')} ${c.cyan(a)}`,
  servOn: a => `${c.green('HTTP server listening')} ${tls()} ${c.cyan(a)}`,
  wssOff: a => `${c.yellow('Socket.io server closed')} ${c.cyan(a)}`,
  wssOn: a => `${c.green('Socket.io server listening')} ${tls()} ${c.cyan(a)}`
}
