const _ = require('lodash')
const joi = require('joi')
const joiValidate = require('../../utils/joiValidate')
const proxiedResource = require('../../models/proxiedResource')

const paramsSchema = {
  project: joi.string().lowercase().token().max(64)
}

const querySchema = {
  include: joi.array().items(joi.string().valid([
    '_id',
    'disabled',
    'request.method',
    'request.target',
    'request.uri',
    'request.body',
    'request.headers',
    'response.body',
    'response.headers',
    'response.statusCode'
  ])),
  // search
  method: joi.array().items(joi.string().uppercase().valid(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])),
  statusCode: joi.array().items(joi.number().positive().integer()),
  uri: joi.array().items(joi.string())
}

module.exports = function * () {
  const params = joiValidate(this.params, paramsSchema)
  const query = joiValidate(this.query, querySchema)
  // TODO paging
  const search = _.pick(query, 'method', 'statusCode', 'uri')
  const items = yield proxiedResource.getAll(params.project, query.include, search)
  this.body = items
}
