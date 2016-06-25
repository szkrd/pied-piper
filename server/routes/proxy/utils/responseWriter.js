// augments koa context
module.exports = (ctx, response) => {
  const rHeaders = response.headers || []
  for (let i in rHeaders) {
    ctx.set(i, rHeaders[i])
  }
  ctx.body = response.body
  ctx.statusCode = response.statusCode
  return ctx
}