// augments koa context
module.exports = (ctx, response) => {
  const rHeaders = response.headers || []
  for (let i in rHeaders) {
    ctx.set(i, rHeaders[i])
  }
  ctx.body = response.body
  // koa raw response would kick in otherwise
  if (response.body === undefined) {
    ctx.body = ''
  }
  ctx.status = response.statusCode
  return ctx
}
