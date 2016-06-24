const shell = require('shelljs')
const config = require('../../config/server')
const repo = {}

shell.ls(`${config.appDir}/fakes/*.js`).forEach(fn => {
  repo[fn.replace(/\.js$/, '')] = require(fn)
})

module.exports = repo
