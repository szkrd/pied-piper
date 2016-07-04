const joi = require('joi')
const joiValidate = require('../../utils/joiValidate')
const proxiedResource = require('../../models/proxiedResource')

const paramsSchema = {
  project: joi.string().lowercase().token().max(64),
  id: joi.string().regex(/^[0-9a-fA-F]{24}$/)
}

module.exports = function * () {
  const params = joiValidate(this.params, paramsSchema)
  yield proxiedResource.remove(params.project, params.id)
  this.body = null
}
