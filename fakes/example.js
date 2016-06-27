/* eslint-disable */
module.exports = [
  {
    url: '/foo/bar?very=param',  // url is required, string or regexp
    method: 'GET',  // method is required, string or regexp
    response: {} // response is required, object or generator function
  },
  {
    url: /\/bar\/foo\?soregex=.*/,
    method: /(GET|POST)/,
    response: {}
  },
  {
    url: /.*/,
    method: /.*/,
    response: function * (url, method, params, body, headers) { // all request
      // simple body with statusCode 200
      // return {}

      // full response
      return {
        headers: [],
        body: {},
        statusCode: 400
      }
    }
  }
]
