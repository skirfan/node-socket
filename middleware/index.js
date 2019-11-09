const Debug = require('debug')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const json = require('./json')
const { static } = require('express')

const middleware = []

if (process.env.NODE_ENV === 'development') {
  const write = t => ({ write: m => Debug(`app:http:${t}`)(m.trim()) })
  middleware.push(morgan('short', { immediate: true, stream: write('req') }))
  middleware.push(morgan('short', { immediate: false, stream: write('res') }))
  middleware.push(cors())
}

middleware.push(helmet())
middleware.push(compression())
middleware.push(json())
middleware.push(static('./public'))

module.exports = middleware
