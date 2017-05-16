const https = require('https')
const fs = require('fs')
const logger = require('winston')
const koa = require('koa')
const cors = require('koa-cors')
const queryStringPatcher = require('koa-qs')
const bodyParser = require('koa-bodyparser')
const multer = require('koa-multer');

const config = require('../config/server')
const db = require('./models/db')
const router = require('./routes')
const errorHandler = require('./utils/errorHandler')
const cleanUp = require('./utils/cleanUp')

require('./utils/fakeRepository') // parse fakes

// config logger
logger.default.transports.console.colorize = true
logger.default.transports.console.prettyPrint = true
logger.level = config.logLevel

// setup koa
const app = koa()
queryStringPatcher(app, 'strict') // enforce arrays
app.use(errorHandler.catchAll)
app.use(errorHandler.raiseFourOhFour)
app.use(multer({ dest: config.uploadDir }))
app.use(bodyParser())
app.use(cors({credentials: true}))
app.use(router.getRoutes())

// register shutdown handler
cleanUp.register()

// startup
db.connect(null, () => {
  app.listen(config.port)
  logger.info(`Listening on ${config.port}`)
  // quick https support
  if (config.httpsKey && config.httpsCert) {
    https.createServer({
      key: fs.readFileSync(config.httpsKey),
      cert: fs.readFileSync(config.httpsCert)
    }, app.callback()).listen(config.httpsPort)
    logger.info(`Listening on ${config.httpsPort}`)
  }
})
