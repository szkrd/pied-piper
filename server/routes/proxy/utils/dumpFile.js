const fs = require('fs')
const crypto = require('crypto')
const logger = require('winston')
const config = require('../../../../config/server')

module.exports = (uri, method, request, response) => {
  const shaSum = crypto.createHash('sha1')
  const output = JSON.stringify({
    at: (new Date()).toISOString(),
    uri,
    method,
    statusCode: response.statusCode,
    body: response.body
  }, null, '  ')

  shaSum.update(method + uri)
  const fileName = shaSum.digest('hex') + '.json'

  fs.writeFile(`${config.dumpDir}/${fileName}`, output, (err) => {
    if (err) {
      logger.error(`Could not dump response for ${method} ${uri}`)
    }
  })
}
