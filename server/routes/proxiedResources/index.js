const getAll = require('./getAll')
const get = require('./get')
const del = require('./del')
const delAll = require('./delAll')
const toggle = require('./toggle')
const put = require('./put')
const sse = require('./sse')

module.exports = {
  getAll,
  get: get,
  delete: del,
  deleteAll: delAll,
  put,
  toggle,
  sse
}
