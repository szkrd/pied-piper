const requiredEnvVars = ['TARGET']

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
  target: process.env.TARGET
}

module.exports = config
