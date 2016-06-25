const logger = require('winston')
const koa = require('koa')
const cors = require('koa-cors')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')

const config = require('../config/server')
const errorHandler = require('./utils/errorHandler')

logger.default.transports.console.colorize = true
logger.default.transports.console.prettyPrint = true
logger.level = config.logLevel

require('./utils/fakeRepository')
const proxy = require('./routes/proxy')
const status = require('./routes/status')

const app = koa()
const router = new Router()

router
  .get('/:project/proxy/*', proxy.get)
  .post('/:project/proxy/*', proxy.post)
  .put('/:project/proxy/*', proxy.put)
  .patch('/:project/proxy/*', proxy.patch)
  .delete('/:project/proxy/*', proxy.delete)
  .get('/api/status', status.get)

app.use(errorHandler)
app.use(bodyParser())
app.use(cors({credentials: true}))
app.use(router.routes())
app.listen(config.port)

logger.info(`Listening on ${config.port}`)
