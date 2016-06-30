const pool = require('../../models/db')

module.exports = function * () {
  const db = pool.get()
  const collectionNamesMeta = yield db.listCollections().toArray()
  const collectionNames = (collectionNamesMeta || []).map(meta => meta.name)
  const projectNamesPrefixed = collectionNames.filter(name => name.startsWith('p_'))
  const projectNames = projectNamesPrefixed.map(name => name.replace(/^p_/, ''))
  this.body = projectNames
}
