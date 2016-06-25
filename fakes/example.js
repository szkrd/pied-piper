module.exports = [
  {
    url: '/foo/bar?very=param',  // url is required, string or regexp
    method: 'GET',  // method is required, string or regexp
    response: {} // response is required, object or function
  },
  {
    url: /\/bar\/foo\?soregex=.*/,
    method: /(GET|POST)/,
    response: {}
  },
  {
    url: /.*/,
    method: /.*/,
    response: function (url, method, params, body, headers) { // all request
      return {}
    }
  }
]
