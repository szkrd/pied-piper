const pool = require('./db')

function remove (name) {
  const collection = pool.collection(`p_${name}`)
  collection.remove({})
}

function getNames () {
  const db = pool.get()
  return db.listCollections().toArray()
    .then(collectionNamesMeta => {
      const collectionNames = (collectionNamesMeta || []).map(meta => meta.name)
      const projectNamesPrefixed = collectionNames.filter(name => name.startsWith('p_'))
      const projectNames = projectNamesPrefixed.map(name => name.replace(/^p_/, ''))
      return projectNames
    })
}

module.exports = {
  remove,
  getNames
}
