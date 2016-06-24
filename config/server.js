const requiredEnvVars = ['TARGET']
const path = require('path')

requiredEnvVars.forEach(req => {
  if (!process.env[req]) {
    throw new Error(`Env var "${req}" missing!`)
  }
})

const env = process.env.NODE_ENV || 'production'

const config = {
  env,
  isProduction: env === 'production',
  isDev: env === 'development',
  logLevel: process.env.LOG_LEVEL || 'error',
  port: process.env.PORT || 3100,
  target: process.env.TARGET,
  appDir: path.resolve(__dirname, '../'),
  dumpDir: path.resolve(__dirname, '../dumps/'),
  dump: true // TODO: allow dynamically switching it on or off
}

module.exports = config
