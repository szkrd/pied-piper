const logger = require('winston')
const rp = require('request-promise')
const config = require('../../../config/server')
const proxyUtils = require('./utils')
const proxiedResource = require('../../models/proxiedResource')

const useFake = proxyUtils.useFake
const dumpFile = proxyUtils.dumpFile
const responseWriter = proxyUtils.responseWriter

function * get (next) {
  const startTime = Date.now()
  const params = this.params
  const method = this.method
  const body = this.request.body
  const headers = this.request.headers
  const target = this.originalUrl.replace(`/${params.project}/proxy`, '')
  const uri = config.target.replace(/\/$/, '') + target
  const rpRequest = { method, uri, body, headers }

  logger.info(`client req ${method}: ${uri}`)
  delete headers.host // don't give away us

  // if we have a fake response, return that and say good bye
  const fakeResponse = useFake(target, method, params, body, headers)
  if (fakeResponse) {
    this.body = fakeResponse
    logger.info(`fake response from 'fakes/${params.project}.js'`)
    yield next
    return
  }

  // try to load it from db, if successful, then do not continue
  const fromDb = yield proxiedResource.load(params.project, rpRequest)
  if (fromDb) {
    const response = fromDb.response
    responseWriter(this, response)
    logger.info(`db res ${method}: ${uri} - ${response.statusCode} #${fromDb._id}`)
    yield next
    return
  }

  // we need the request to the api
  const options = Object.assign({
    json: true,
    resolveWithFullResponse: true,
    simple: false
  }, rpRequest)

  let response
  try {
    response = yield rp(options)
  } catch (err) {
    logger.error(`Request failed due to technical reasons (${uri})`)
    yield next
    return
  }

  if (config.dump) {
    dumpFile(uri, method, this.request, response)
  }

  // if the response was fine, save it to the db
  yield proxiedResource.save(
    params.project,
    Object.assign({ target }, rpRequest),
    response
  )
  logger.info(`Saved response from ${uri} to db [${params.project}]`)

  responseWriter(this, response)
  const elapsed = Math.round((Date.now() - startTime) / 1000)
  logger.info(`server res ${method}: ${uri} - ${response.statusCode} in ${elapsed}s`)
  yield next
}

module.exports = {
  get: get,
  put: get,
  post: get,
  patch: get,
  delete: get
}
