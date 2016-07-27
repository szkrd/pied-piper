const _ = require('lodash')
const ObjectId = require('mongodb').ObjectId
const db = require('./db')
const getCollection = (n) => db.collection(`p_${n}`)

function load (collectionName, request, strict) {
  const collection = getCollection(collectionName)
  const query = {
    'request.method': request.method,
    'request.uri': request.uri
  }
  if (strict) {
    query['request.body'] = request.body
  }
  return collection.findOne(query)
}

function save (collectionName, request, response, strict) {
  const collection = getCollection(collectionName)
  const query = {
    'request.method': request.method,
    'request.uri': request.uri
  }
  if (strict) {
    query['request.body'] = request.body
  }
  return collection.findOneAndReplace(query, {
    sleep: 0,
    lastModified: new Date(),
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

// TODO paging, proper sort
function getAll (collectionName, includes, search, sort) {
  const sortKey = sort.sortKey || 'lastModified'
  const sortDir = sort.sortDir || -1
  const query = {}
  includes = includes || {
    _id: 1,
    disabled: 1,
    sleep: 1,
    lastModified: 1,
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
  return collection.find(query, includes).sort({[sortKey]: sortDir}).toArray()
}

function get (collectionName, id) {
  const collection = getCollection(collectionName)
  return collection.findOne({_id: new ObjectId(id)})
}

function set (collectionName, id, overlay) {
  const collection = getCollection(collectionName)
  return get(collectionName, id)
    .then(result => {
      return collection
        .findOneAndReplace(
          {_id: new ObjectId(id)},
          _.assign(result, overlay), // do not merge
          {upsert: true}
        )
    })
}

function remove (collectionName, id) {
  const collection = getCollection(collectionName)
  return collection.remove({_id: new ObjectId(id)})
}

function removeAll (collectionName) {
  const collection = getCollection(collectionName)
  return collection.remove({})
}

function toggle (collectionName, id) {
  const collection = getCollection(collectionName)
  return collection
    .findOne({_id: new ObjectId(id)})
    .then(result => { // TODO no result?
      return collection.updateOne(
        {_id: new ObjectId(id)},
        {$set: {disabled: !result.disabled}}
      )
    })
}

module.exports = {
  save,
  load,
  toggle,
  get: get,
  set: set,
  getAll,
  remove,
  removeAll
}
