const joi = require('joi')
const joiValidate = require('../../utils/joiValidate')
const projects = require('../../models/projects')

const paramsSchema = {
  project: joi.string().lowercase().token().max(64)
}

// flush everything from collection
module.exports = function * () {
  const params = joiValidate(this.params, paramsSchema)
  projects.remove(params.project)
  this.body = null
}
