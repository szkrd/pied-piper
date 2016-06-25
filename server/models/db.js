const logger = require('winston')
const mongodb = require('mongodb')
const config = require('../../config/server')
let db

const getDb = () => db
const setDb = connectedDb => { db = connectedDb }

// connect and save connection to pool
function connect (errorCb, successCb) {
  const mongoClient = mongodb.MongoClient
  mongoClient.connect(config.mongoDbUri, (err, db) => {
    // inline error handling
    if (err) {
      logger.error(`Could not connect to database '${config.mongoDbUri}'`)
      if (typeof errorCb === 'function') {
        errorCb()
      }
      throw err
    }
    // things are okay, store connection, call success
    logger.info(`Connected to '${config.mongoDbUri.replace(/(\/{2}).*?@/g, '$1')}'`)
    setDb(db)
    successCb()
  })
}

function collection (name) {
  if (!name) {
    throw new Error('db collection name not set')
  }
  return db.collection(name)
}

module.exports = {
  get: getDb,
  set: setDb,
  collection,
  init: connect,
  connect
}
