module.exports = [
  {
    url: '/asset/map?languageCode=en-gb',
    method: 'GET',
    response: {}
  },
  {
    url: /\/asset\/route\?destination=.*/,
    method: /(GET|POST)/,
    response: {}
  },
  {
    url: /.*/,
    callback: function (url, method, params, body, headers) { // all request
      return {}
    }
  }
]
