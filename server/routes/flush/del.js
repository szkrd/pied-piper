const db = require('../../models/db')

// flush everything from collection
module.exports = function * () {
  const params = this.params
  const collection = db.collection(params.project)
  collection.remove({})
  this.body = null
}
