module.exports = (response) => {
  const body = response.body
  const statusCode = response.statusCode
  // dotnet style error
  if (statusCode !== 200 && typeof body === 'string' && body.indexOf('Runtime Error') > -1) {
    return true
  }
  return false
}
