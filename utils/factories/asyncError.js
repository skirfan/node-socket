const reportError = require('utils/reportErr')

module.exports = async func => {
  try {
    return await func()
  } catch (e) {
    return reportError(e)
  }
}
