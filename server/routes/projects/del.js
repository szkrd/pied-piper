const joi = require('joi')
const joiValidate = require('../../utils/joiValidate')
const db = require('../../models/db')

const paramsSchema = {
  project: joi.string().lowercase().token().max(64)
}

// flush everything from collection
module.exports = function * () {
  const params = joiValidate(this.params, paramsSchema)
  const collection = db.collection(`p_${params.project}`)
  collection.remove({})
  this.body = null
}
