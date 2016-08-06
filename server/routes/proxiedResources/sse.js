const logger = require('winston')
const PassThrough = require('stream').PassThrough
const joi = require('joi')
const joiValidate = require('../../utils/joiValidate')
const proxiedResource = require('../../models/proxiedResource')
const eventBus = require('../../models/eventBus')
let sseCount = 0

const paramsSchema = {
  project: joi.string().lowercase().token().max(64)
}

const sse = (event, data) => {
  return `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
}

// koa sse channel
// examples:
//   * https://github.com/koajs/koa/issues/543
//   * https://github.com/koajs/examples/blob/master/stream-server-side-events/app.js
module.exports = function * () {
  const params = joiValidate(this.params, paramsSchema)
  const projectInUrl = params.project
  const stream = new PassThrough()

  sseCount += 1
  this.req.setTimeout(Number.MAX_VALUE)

  const listener = (project, id) => {
    if (projectInUrl !== project) {
      return
    }
    proxiedResource.get(project, id)
      .then(item => {
        if (item) {
          stream.write(sse('proxiedResource.save', item))
        }
      })
  }

  const close = () => {
    sseCount -= 1
    stream.unpipe(body)
    socket.removeListener('error', close)
    socket.removeListener('close', close)
    eventBus.removeListener('proxiedResource.save', listener)
    logger.info(`sse disconnect, active connection count: ${sseCount}`)
  }

  eventBus.on('proxiedResource.save', listener)

  this.type = 'text/event-stream'
  const body = this.body = stream

  var socket = this.socket
  socket.on('error', close)
  socket.on('close', close)
}
