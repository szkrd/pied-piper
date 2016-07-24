const _ = require('lodash')
const config = require('../../../config/server')
const runtimeConfig = require('../../models/runtimeConfig')
const fakes = require('../../utils/fakeRepository')

const joi = require('joi')
const joiValidate = require('../../utils/joiValidate')

// empty query includes all
const querySchema = {
  include: joi.array().items(joi.string().valid([
    'preFlight',
    'fakes',
    'recording',
    'active',
    'dump',
    'sleep',
    'disabledProjects',
    'strict'
  ]))
}

module.exports = function * () {
  const query = joiValidate(this.query, querySchema)
  const status = { preFlight: _.pick(config, ['env', 'port', 'target']) }
  status.fakes = (Object.keys(fakes) || []).sort()
  const runtime = yield runtimeConfig.get()
  const runtimeClean = _.omit(runtime, '_id', 'name')

  // half of this would be better off in the model, maybe later...
  let merged = Object.assign(status, runtimeClean)
  if (query.include) {
    merged = _.pick(merged, query.include)
  }

  this.body = merged
}
