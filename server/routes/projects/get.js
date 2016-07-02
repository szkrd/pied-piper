const projects = require('../../models/projects')

module.exports = function * () {
  const projectNames = yield projects.getNames()
  this.body = projectNames
}
