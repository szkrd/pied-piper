var joi = require('joi')

// wrapper for joi, that throws errors
module.exports = (value, schema) => {
  if (!schema.isJoi) {
    schema = joi.object().keys(schema)
  }
  const result = joi.validate(value, schema)
  if (result.error) {
    throw new Error(result.error)
  }
  return result.value
}
