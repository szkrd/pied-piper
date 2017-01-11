const db = require('./db')
const collectionName = 'config'
const configName = 'runtime'

// default config, will be injected into db upon first change
const config = {
  strict: false, // match and record with request body
  recording: true, // store successful responses in the db
  active: true, // if inactive, all the requests will be forwarded to the remote api
  dump: true, // save responses into dump directory
  sleep: 0, // sleep in sec
  retryLockTimeout: 0, // retry locking in sec
  disabledProjects: [] // array of strings, same as active, but on a per project basis
}

// get from db or default
function get () {
  const coll = db.collection(collectionName)
  return coll.findOne({ name: configName })
    .then(result => {
      if (!result) {
        return config
      }
      return result
    })
}

// set config then save to db
function set (overlay) {
  const coll = db.collection(collectionName)
  return get()
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
