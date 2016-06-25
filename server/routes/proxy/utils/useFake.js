const _ = require('lodash')
const logger = require('winston')
const repo = require('../../../utils/fakeRepository')

const rexify = (s) => _.isRegExp(s) ? s : new RegExp(_.escapeRegExp(s))

module.exports = (url, method, params, body, headers) => {
  const project = params.project
  const projectRepo = repo[project]
  console.log(project, projectRepo, repo)
  if (!projectRepo) {
    return
  }
  if (!_.isArray(projectRepo)) {
    logger.warn(`Fake '${project}' - should be an array!`)
    return
  }

  let found
  _.forEach(projectRepo, (rule, i) => {
    // url is required
    if (!rule.url) {
      logger.warn(`Fake rule has no url field '${project}' #${i}`)
      return true
    }
    const urlRex = rexify(rule.url)
    if (!urlRex.test(url)) {
      return true
    }
    // method is required
    if (!rule.method) {
      logger.warn(`Fake rule has no method field '${project}' '${rule.url}'`)
      return true
    }
    const methodRex = rexify(rule.method)
    if (!methodRex.test(method)) {
      return true
    }
    // response is required
    if (!rule.response) {
      logger.warn(`Fake rule has no response field '${project}' '${rule.url}'`)
      return true
    }
    // finally
    if (typeof rule.response === 'function') {
      found = rule.response(url, method, params, body, headers)
      return false // done
    }
    found = rule.response
    return false // done
  })
  return found
}
