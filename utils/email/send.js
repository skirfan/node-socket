const nodemailer = require('nodemailer')
const config = require('config')

const mailerConfig = {
  ...config.get('mailer'),
  auth: {
    user: process.env.MAILER_AUTH_USER,
    pass: process.env.MAILER_AUTH_PASS
  }
}

const from = `${config.get('mailFrom')} <${mailerConfig.auth.user}>`

const transport = nodemailer.createTransport(mailerConfig)

module.exports = async (to, subject, html) => {
  try {
    return await transport.sendMail({ from, to, subject, html })
  } catch (error) {
    return false
  }
}
