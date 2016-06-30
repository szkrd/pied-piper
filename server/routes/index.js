const Router = require('koa-router')
const proxy = require('./proxy')
const rtConfig = require('./config')
const flush = require('./flush')
const projects = require('./projects')
const router = new Router()

router
  .get('/:project/proxy/*', proxy.get)
  .post('/:project/proxy/*', proxy.post)
  .put('/:project/proxy/*', proxy.put)
  .patch('/:project/proxy/*', proxy.patch)
  .delete('/:project/proxy/*', proxy.delete)
  .get('/api/projects', projects.get)
  .get('/api/config', rtConfig.get)
  .put('/api/config', rtConfig.put)
  .put('/api/config/toggle-project/:project', rtConfig.toggleProject.put)
  .delete('/api/flush/:project', flush.delete)

module.exports = {
  getRoutes: () => router.routes()
}
