const db = require('./db')
const collectionName = 'config'
const configName = 'runtime'

// default config, will be injected into db upon first change
const config = {
  dump: true
}

// get from db or default
function get () {
  const coll = db.collection(collectionName)
  return coll.findOne({ name: configName })
    .then(result => {
      if (result === null) {
        return config
      }
      return result
    })
}

// set config then save to db
function set (overlay) {
  const coll = db.collection(collectionName)
  get()
    .then(result => {
      return coll
        .findOneAndReplace(
          {name: configName},
          Object.assign({name: configName}, result, overlay),
          {upsert: true}
        )
    })
}

module.exports = {
  get: get,
  set: set
}