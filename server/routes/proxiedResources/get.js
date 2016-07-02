const joi = require('joi')
const joiValidate = require('../../utils/joiValidate')
const proxiedResource = require('../../models/proxiedResource')

const paramsSchema = {
  project: joi.string().lowercase().token().max(64),
  id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}

module.exports = function * () {
  const params = joiValidate(this.params, paramsSchema)
  const item = yield proxiedResource.get(params.project, params.id)
  if (!item) {
    this.throw('Proxied Resource Not Found', 404)
  }
  this.body = item
}
