const _ = require('lodash')
const logger = require('winston')
const sleep = require('co-sleep')
const rp = require('request-promise')
const joi = require('joi')
const joiValidate = require('../../utils/joiValidate')
const config = require('../../../config/server')
const proxyUtils = require('./utils')
const proxiedResource = require('../../models/proxiedResource')
const runtimeConfig = require('../../models/runtimeConfig')
const eventBus = require('../../models/eventBus')

const useFake = proxyUtils.useFake
const dumpFile = proxyUtils.dumpFile
const responseWriter = proxyUtils.responseWriter
const isServerError = proxyUtils.isServerError
const retryBlacklist = {} // do not use a map

const paramsSchema = {
  project: joi.string().lowercase().token().max(64)
}

const UNZIP = true
const MAX_SLEEP = 10
const getSleep = (n) => _.clamp(parseInt(n, 10) || 0, 0, MAX_SLEEP) * 1000

function * get (next) {
  const runtime = yield runtimeConfig.get()
  let active = runtime.active
  const startTime = Date.now()
  const params = joiValidate({project: _.get(this, 'params.project')}, paramsSchema)
  const method = this.method
  const body = this.request.body
  const headers = this.request.headers
  const target = this.originalUrl.replace(`/${params.project}/proxy`, '')
  const uri = config.target.replace(/\/$/, '') + target
  const rpRequest = { method, uri, body, headers }
  const rpRequestStr = JSON.stringify(rpRequest)
  const retryLockTimeout = runtime.retryLockTimeout * 1000

  // if this project had been explicitly disabled, then set active to false
  if ((runtime.disabledProjects || []).includes(params.project)) {
    active = false
  }

  logger.info(`client req ${method}: ${uri}`)
  delete headers.host // don't give away us

  // sleep a bit (global sleep value)
  if (runtime.sleep) {
    yield sleep(getSleep(runtime.sleep))
  }

  // if we have a fake response, return that and say good bye
  const fakeResponse = yield useFake(target, method, params, body, headers)
  if (fakeResponse && active) {
    responseWriter(this, fakeResponse)
    logger.info(`fake response from 'fakes/${params.project}.js'`)
    yield next
    return
  }

  // try to load it from db, if successful, then do not continue
  const fromDb = yield proxiedResource.load(params.project, rpRequest, runtime.strict)
  if (fromDb && active && !fromDb.disabled) {
    const response = fromDb.response
    if (response.sleep) {
      yield sleep(getSleep(response.sleep))
    }
    responseWriter(this, response)
    logger.info(`db res ${method}: ${uri} - ${response.statusCode} #${fromDb._id}`)
    yield next
    return
  }

  // either request or the browser trying to agressively retry urls (for resp 408)
  let itemTried = retryBlacklist[rpRequestStr]
  if (itemTried && Date.now() - itemTried.timestamp > retryLockTimeout) {
    delete retryBlacklist[rpRequestStr]
    itemTried = false
  }
  if (retryLockTimeout && itemTried) {
    responseWriter(this, { statusCode: 408 })
    logger.warn(`Flood protected ${uri}`)
    yield next
    return
  }

  // we need the request to the api
  const options = Object.assign({
    timeout: 120 * 1000, // try to avoid retry on timeout (https://github.com/request/request/issues/2421)
    json: true,
    gzip: UNZIP,
    resolveWithFullResponse: true,
    simple: false,
    strictSSL: false
  }, rpRequest)

  let response
  let netParseErrorWithIIS
  const aspNet = (_.get(options, 'headers.cookie') || '').indexOf('ASP.NET') > -1
  try {
    response = yield rp(options)
  } catch (err) {
    let subReason = ''
    logger.error(`Request failed due to technical reasons (${uri})`)
    if (err.cause.code === 'ETIMEDOUT') {
      subReason = ` - request timed out (${uri})`
    }
    if (err.cause.code === 'HPE_INVALID_CONSTANT' && aspNet) {
      netParseErrorWithIIS = true
    } else {
      this.throw(`Technical Reasons${subReason}`, 500)
    }
  }

  // FIXME with a terrible hack... try using curl in childprocess?
  if (netParseErrorWithIIS) {
    this.throw('Node Versus IIS', 512)
  }

  if (response.statusCode === 408 && retryLockTimeout) {
    retryBlacklist[rpRequestStr] = { timestamp: Date.now() }
  }

  // severe errors (but not technical) - probably the response is not even a valid json
  // (attach responseBody so that the client may have a clue about what happened)
  if (isServerError(response)) {
    logger.error(`Request failed due to severe server error (${uri})`)
    this.throw({ message: 'Remote Server Error', status: 500, responseBody: response.body })
  }

  if (runtime.dump) {
    dumpFile(uri, method, this.request, response)
  }

  // if the response was fine, save it to the db
  if (runtime.recording) {
    const operation = yield proxiedResource.save(
      params.project,
      Object.assign({ target }, rpRequest),
      response,
      runtime.strict
    )
    const id = (_.get(operation, '_id') || _.get(operation, 'lastErrorObject.upserted') || '') + ''
    if (id) {
      eventBus.emit('proxiedResource.save', params.project, id)
    }
    logger.info(`Saved response from ${uri} to db [${params.project}]`)
  } else {
    logger.info(`Recording disabled, not saving ${uri}`)
  }

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
