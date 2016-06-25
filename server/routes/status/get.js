const _ = require('lodash')
const config = require('../../../config/server')
const runtimeConfig = require('../../models/runtimeConfig')
const fakes = require('../../utils/fakeRepository')

module.exports = function * () {
  const status = _.pick(config, ['env', 'port', 'target'])
  const runtime = yield runtimeConfig.get()
  status.fakes = (Object.keys(fakes) || []).sort()
  status.dump = runtime.dump
  this.body = status
}
