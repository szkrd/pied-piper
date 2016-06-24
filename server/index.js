const logger = require('winston')
const koa = require('koa')
const cors = require('koa-cors')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const config = require('../config/server')
// const errorHandler = require('./utils/errorHandler')

logger.default.transports.console.colorize = true
logger.default.transports.console.prettyPrint = true
logger.level = config.logLevel

const proxy = require('./routes/proxy')

const app = koa()
const router = new Router()

router
  .get('/:db/proxy/*', proxy.get)
  .post('/:db/proxy', proxy.post)
  .put('/:db/proxy', proxy.put)
  .patch('/:db/proxy', proxy.patch)
  .delete('/:db/proxy', proxy.delete)

app.use(bodyParser())
app.use(cors({credentials: true}))
app.use(router.routes())
app.listen(config.port)

logger.info(`Listening on ${config.port}`)
