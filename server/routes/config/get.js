const _ = require('lodash')
const config = require('../../../config/server')
const runtimeConfig = require('../../models/runtimeConfig')
const fakes = require('../../utils/fakeRepository')

module.exports = function * () {
  const status = { preFlight: _.pick(config, ['env', 'port', 'target']) }
  status.fakes = (Object.keys(fakes) || []).sort()
  const runtime = yield runtimeConfig.get()
  const runtimeClean = _.omit(runtime, '_id', 'name')
  this.body = Object.assign(status, runtimeClean)
}
