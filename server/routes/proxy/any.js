const logger = require('winston')
const rp = require('request-promise')
const config = require('../../../config/server')
require('shelljs/global')

function * get () {
  let responseSource = 'server'
  const startTime = Date.now()
  const params = this.params
  const method = this.method
  const target = this.originalUrl.replace(`/${params.db}/proxy`, '')
  const uri = config.target.replace(/\/$/, '') + target

  logger.info(`client req ${method.toUpperCase()}: ${uri}`)

  const options = {
    method,
    uri,
    body: this.request.body,
    json: true,
    resolveWithFullResponse: true,
    simple: false
  }

  const response = yield rp(options)

  const rHeaders = response.headers || []
  for (let i in rHeaders) {
    this.set(i, rHeaders[i])
  }
  this.body = response.body
  this.statusCode = response.statusCode

  const elapsed = Math.round((Date.now() - startTime) / 1000)
  logger.info(`${responseSource} res ${method.toUpperCase()}: ${uri} - ${response.statusCode} in ${elapsed}s`)
}

module.exports = {
  get: get,
  put: get,
  post: get,
  patch: get,
  delete: get
}