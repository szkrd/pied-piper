const getAll = require('./getAll')
const get = require('./get')
const del = require('./del')
const delAll = require('./delAll')
const toggle = require('./toggle')

module.exports = {
  getAll,
  get: get,
  delete: del,
  deleteAll: delAll,
  toggle
}
