const logger = require('winston')
const pool = require('../models/db')

function done (cb) {
  const db = pool.get()
  if (db) {
    db.close()
  }
  logger.info('Shutdown.')
  if (typeof cb === 'function') {
    cb()
  }
}

// http://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
function register () {
  // nodemon
  process.once('SIGUSR2', () => {
    done()
    process.kill(process.pid, 'SIGUSR2')
  })

  process.on('cleanup', done)
  process.on('exit', () => { process.emit('cleanup') })
  process.on('SIGINT', () => { process.exit(2) }) // ctrl+c

  // catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', (e) => {
    logger.error('Uncaught Exception')
    console.log(e.stack)
    process.exit(99)
  })
}

module.exports = {
  register
}
