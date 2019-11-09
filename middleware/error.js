const debug = require('debug')('app:middleware:error')
const reportErr = require('utils/reportErr')(debug)
const { wentWrong } = require('utils/errorMessages')

module.exports = (err, req, res, next) => {
  reportErr(err)
  wentWrong(res)
  next()
}
