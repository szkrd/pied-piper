const http = require('http')
const logger = require('winston')
const PrettyError = require('pretty-error')
const config = require('../../config/server')
const pe = new PrettyError()

pe.appendStyle({
  'pretty-error > trace > item': {
    marginBottom: 0
  }
})

function * raiseFourOhFour (next) {
  yield next
  var status = this.status || 404
  if (status === 404) {
    this.throw(404)
  }
}

function * catchAll (next) {
  try {
    yield next
  } catch (err) {
    if (config.isDev) {
      console.log(pe.render(err))
    } else {
      logger.error(err)
    }

    let resp = {
      source: 'app', // not the remote api!
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }

    if (err.message.startsWith('ValidationError')) {
      resp.status = 400
    }

    resp.error = http.STATUS_CODES[resp.status]
    this.status = resp.status
    this.body = resp
  }
}

module.exports = {
  raiseFourOhFour,
  catchAll
}
