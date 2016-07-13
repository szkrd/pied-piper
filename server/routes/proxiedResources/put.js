const joi = require('joi')
const joiValidate = require('../../utils/joiValidate')
const proxiedResource = require('../../models/proxiedResource')

const paramsSchema = {
  project: joi.string().lowercase().token().max(64),
  id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}

const bodySchema = {
  sleep: joi.number().integer().max(10),
  disabled: joi.boolean(),
  request: joi.object().keys({
    method: joi.string().uppercase().valid('GET', 'POST', 'PUT', 'PATCH', 'DELETE'),
    uri: joi.string().uri({ scheme: [ 'http', 'https' ] }),
    target: joi.string(),
    body: joi.object(),
    headers: joi.object()
  }),
  response: joi.object().keys({
    body: joi.object(),
    headers: joi.object(),
    statusCode: joi.number().integer().min(100).max(600)
  })
}

module.exports = function * () {
  const params = joiValidate(this.params, paramsSchema)
  const body = joiValidate(this.request.body, bodySchema)
  if (body.sleep !== undefined) {
    body.sleep = body.sleep < 0 ? 0 : body.sleep
  }
  yield proxiedResource.set(params.project, params.id, body)
  this.body = null
}
