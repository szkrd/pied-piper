const Router = require('koa-router')
const proxy = require('./proxy')
const rtConfig = require('./config')
const projects = require('./projects')
const proxiedResources = require('./proxiedResources')
const router = new Router()

router
  .get('/:project/proxy/*', proxy.get)
  .post('/:project/proxy/*', proxy.post)
  .put('/:project/proxy/*', proxy.put)
  .patch('/:project/proxy/*', proxy.patch)
  .delete('/:project/proxy/*', proxy.delete)

  .get('/api/projects', projects.get)
  .delete('/api/projects/:project', projects.delete)

  .get('/api/config', rtConfig.get)
  .put('/api/config', rtConfig.put)
  .put('/api/config/toggle-project/:project', rtConfig.toggleProject.put)

  .get('/api/proxied-resources/:project', proxiedResources.getAll)
  .get('/api/proxied-resource/:project/:id', proxiedResources.get)
  .delete('/api/proxied-resource/:project/:id', proxiedResources.delete)
  .delete('/api/proxied-resources/:project', proxiedResources.deleteAll)
  .put('/api/proxied-resource/toggle/:project/:id', proxiedResources.toggle.put)

module.exports = {
  getRoutes: () => router.routes()
}
