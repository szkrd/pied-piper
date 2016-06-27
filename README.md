# pied-piper

Transparent, aggressive API cache/proxy.

Pied piper is a tool to alleviate the pain of working with slow APIs. It can:

* store API responses in a database and retrieve them,
  instead of trying to fetch it from the API itself.
* dump server responses so you can edit or review them
* respond with fake data for different requests

It uses no etags and tries to be as transparent as possible,
but it is a high level tool, meant to work with JSON requests/responses.

## usage

Instead of calling your `http://foo.bar.dev:8080/api/`,
you have to change the api url in your frontend code to be something
like `http://localhost:3100/myproject/proxy` (_myproject_ can be
a name of your session, project or anything, this will be the collection
id in the database and it will group requests together).

## runtime configuration

* __recording__: toggle recording of responses into db
* __active__: if inactive, all the requests will be forwarded to the remote api
* __dump__: save responses into dump directory
* __sleep__: sleep in sec (to sleep on a certain response only, use fakes' generator response)
* __disabledProjects__: array of strings, same as active, but on a per project basis

See [default values](./server/models/runtimeConfig.js),
[api interface](./server/routes/config/put.js)

## env vars example

```json
{
  "env": {
    "LOG_LEVEL": "silly",
    "NODE_ENV": "development",
    "TARGET": "http://dev.foo.bar.local/api",
    "MONGODB_URI": "mongodb://localhost:27017/piedpiper"
  }
}
```
