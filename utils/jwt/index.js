const jwt = require('jsonwebtoken')
const reportError = require('utils/reportErr')
const promisified = require('utils/promisified')

exports.generate = async object => {
  try {
    const key = await promisified.fs.readFile('./.keys/jwt_rsa.key')
    return jwt.sign(object, key, { algorithm: 'RS256' })
  } catch (e) {
    return reportError(e.message)
  }
}

exports.verify = async token => {
  try {
    const key = await promisified.fs.readFile('./.keys/jwt_rsa.key.pub')
    return jwt.verify(token, key, { algorithm: 'RS256' })
  } catch (e) {
    return reportError(e.message)
  }
}
