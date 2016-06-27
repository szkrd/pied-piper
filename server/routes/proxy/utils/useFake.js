const _ = require('lodash')
const logger = require('winston')
const repo = require('../../../utils/fakeRepository')

const rexify = (s) => _.isRegExp(s) ? s : new RegExp(_.escapeRegExp(s))

module.exports = function * useFake (url, method, params, body, headers) {
  const project = params.project
  const projectRepo = repo[project]
  if (!projectRepo) {
    return
  }
  if (!_.isArray(projectRepo)) {
    logger.warn(`Fake '${project}' - should be an array!`)
    return
  }

  let found
  for (let i = 0, l = projectRepo.length; i < l; i++) {
    const rule = projectRepo[i]
    // url is required
    if (!rule.url) {
      logger.warn(`Fake rule has no url field '${project}' #${i}`)
      continue
    }
    const urlRex = rexify(rule.url)
    if (!urlRex.test(url)) {
      continue
    }
    // method is required
    if (!rule.method) {
      logger.warn(`Fake rule has no method field '${project}' '${rule.url}'`)
      continue
    }
    const methodRex = rexify(rule.method)
    if (!methodRex.test(method)) {
      continue
    }
    // response is required
    if (!rule.response) {
      logger.warn(`Fake rule has no response field '${project}' '${rule.url}'`)
      continue
    }
    // finally
    if (typeof rule.response === 'function') {
      if (!rule.response.constructor.name === 'GeneratorFunction') {
        logger.warn(`Fake rule function must be a generator '${project}' '${rule.url}'`)
        found = rule.response(url, method, params, body, headers)
      } else {
        found = yield rule.response(url, method, params, body, headers)
      }
    } else if (typeof rule.response === 'object') {
      found = rule.response
    }
    break
  }
  if (typeof found === 'object' && (!found.body && !found.status)) {
    found = { statusCode: 200, body: found }
  }
  return found
}
