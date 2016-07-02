const _ = require('lodash')
const ObjectId = require('mongodb').ObjectId
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

// TODO paging
function getAll (collectionName, includes, search) {
  const query = {}
  includes = includes || {
    _id: 1,
    'request.method': 1,
    'request.uri': 1,
    'response.statusCode': 1
  }
  search = search || {}
  if (search.method) {
    query['request.method'] = {$in: search.method}
  }
  if (search.statusCode) {
    query['response.statusCode'] = {$in: search.statusCode}
  }
  if (search.uri) {
    // not the best, but $text is a whole different beast
    const escapedUris = search.uri.map(sRex => _.escapeRegExp(sRex))
    query['request.uri'] = new RegExp(escapedUris.join('|'), 'gi')
  }
  const collection = getCollection(collectionName)
  return collection.find(query, includes).toArray()
}

function get (collectionName, id) {
  const collection = getCollection(collectionName)
  return collection.findOne({_id: new ObjectId(id)})
}

module.exports = {
  save,
  load,
  get: get,
  getAll
}
