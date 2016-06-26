const _ = require('lodash')
const joi = require('joi')
const joiValidate = require('../../../utils/joiValidate')
const runtimeConfig = require('../../../models/runtimeConfig')

const paramsSchema = {
  project: joi.string().lowercase().token().max(64)
}

module.exports = function * () {
  const params = joiValidate(this.params, paramsSchema)
  const project = params.project
  const rtConfig = yield runtimeConfig.get()
  const disabledProjects = rtConfig.disabledProjects || []
  if (disabledProjects.includes(project)) {
    _.pull(disabledProjects, project)
  } else {
    disabledProjects.push(project)
  }
  yield runtimeConfig.set({
    disabledProjects: _.sortedUniq(disabledProjects)
  })
  this.body = null
}
