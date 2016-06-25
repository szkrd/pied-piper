const db = require('./db')
const getCollection = (n) => db.collection(`p_${n}`)

function load (collectionName, request) {
  const collection = getCollection(collectionName)
  return collection.findOne({
    'request.method': request.method,
    'request.uri': request.uri
  })
}

function save (collectionName, request, response) {
  const collection = getCollection(collectionName)
  return collection.findOneAndReplace({
    'request.method': request.method,
    'request.uri': request.uri
  }, {
    request: {
      method: request.method,
      target: request.target, // relative target api
      uri: request.uri, // full target with protocol, domain etc.
      body: request.body,
      headers: request.headers
    },
    response: {
      headers: response.headers,
      body: response.body,
      statusCode: response.statusCode
    }
  }, {
    upsert: true
  })
}

module.exports = {
  save,
  load
}
