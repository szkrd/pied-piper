const shell = require('shelljs')
const config = require('../../config/server')
const repo = {}

shell.ls(`${config.appDir}/fakes/*.js`).forEach(fn => {
  const shortName = (fn.match(/([^/]*)\.js$/) || [])[1]
  if (shortName) {
    repo[shortName] = require(fn)
  }
})

module.exports = repo
