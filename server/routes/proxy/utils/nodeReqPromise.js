// this is a thin wrapper around node http request
// use it as a playground or to customize the request itself
// which is not possible with the request-promise library
const http = require('http')
const https = require('https')
const url = require('url')

// "convert" request promise options to raw options (for node http)
function getRawOptions (rpOpts) {
  const uri = url.parse(rpOpts.uri)
  return {
    method: rpOpts.method,
    hostname: uri.hostname,
    port: uri.port || null,
    path: uri.path || '/',
    headers: rpOpts.headers
  }
}

module.exports = function (opts, wtf) {
  const rawOptions = getRawOptions(opts)
  let transport
  if (/^https:/.test(opts.uri)) {
    transport = https
  } else if (/^http:/.test(opts.uri)) {
    transport = http
  } else {
    throw new Error('Unknown protocol.')
  }
  // if you can tell me what the actual fuck is happening you are eligible for a free beer
  if (wtf) {
    rawOptions.headers = { 'content-type': rawOptions.headers['content-type'] }
  }
  // unfortunately native TCP socket errors are uncatchable
  return new Promise((resolve, reject) => {
    const req = transport.request(rawOptions, res => {
      const chunks = []
      res.on('error', err => reject(err))
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => {
        const body = Buffer.concat(chunks)
        res.body = body.toString()
        if (opts.json) {
          try {
            res.body = JSON.parse(res.body)
            resolve(res)
          } catch (err) {
            reject(err)
          }
        } else {
          resolve(res)
        }
      })
    })
    req.write(JSON.stringify(opts.body))
    req.end()
  })
}
