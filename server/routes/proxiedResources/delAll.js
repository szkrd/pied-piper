const joi = require('joi')
const joiValidate = require('../../utils/joiValidate')
const proxiedResource = require('../../models/proxiedResource')

const paramsSchema = {
  project: joi.string().lowercase().token().max(64)
}

module.exports = function * () {
  const params = joiValidate(this.params, paramsSchema)
  yield proxiedResource.removeAll(params.project)
  this.body = null
}
