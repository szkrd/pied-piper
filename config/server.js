const requiredEnvVars = ['TARGET', 'MONGODB_URI']
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
  mongoDbUri: process.env.MONGODB_URI,
  target: process.env.TARGET,
  appDir: path.resolve(__dirname, '../'),
  dumpDir: path.resolve(__dirname, '../dumps/'),
}

module.exports = config
