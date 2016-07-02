const _ = require('lodash')
const joi = require('joi')
const runtimeConfig = require('../../models/runtimeConfig')
const joiValidate = require('../../utils/joiValidate')

const bodySchema = {
  active: joi.boolean(),
  recording: joi.boolean(),
  dump: joi.boolean(),
  sleep: joi.number().integer().max(60),
  disabledProjects: joi.array().items(
    joi.string().lowercase().token().max(64),
    joi.any().strip()
  )
}

module.exports = function * () {
  const body = joiValidate(this.request.body, bodySchema)
  if (body.disabledProjects !== undefined) {
    body.disabledProjects = _.sortedUniq(body.disabledProjects || [])
  }
  if (body.sleep !== undefined) {
    body.sleep = body.sleep < 0 ? 0 : body.sleep
  }
  yield runtimeConfig.set(body)
  this.body = null
}
