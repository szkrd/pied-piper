const _ = require('lodash')
const config = require('../../../config/server')
const fakes = require('../../utils/fakeRepository')

module.exports = function * () {
  const status = _.pick(config, ['env', 'port', 'target', 'dump'])
  status.fakes = (Object.keys(fakes) || []).sort()
  this.body = status
}
