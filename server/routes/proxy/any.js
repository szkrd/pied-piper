const logger = require('winston')
const rp = require('request-promise')
const config = require('../../../config/server')
const proxyUtils = require('./utils')
require('shelljs/global')

function * get () {
  let responseSource = 'server'
  const startTime = Date.now()
  const params = this.params
  const method = this.method
  const body = this.request.body
  const headers = this.request.headers
  const target = this.originalUrl.replace(`/${params.db}/proxy`, '')
  const uri = config.target.replace(/\/$/, '') + target

  logger.info(`client req ${method.toUpperCase()}: ${uri}`)
  delete headers.host // don't give away us

  const options = {
    method,
    uri,
    body,
    headers,
    json: true,
    resolveWithFullResponse: true,
    simple: false
  }

  // TODO proper error wrapping
  const response = yield rp(options)

  if (config.dump) {
    proxyUtils.dumpFile(uri, method, this.request, response)
  }

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
