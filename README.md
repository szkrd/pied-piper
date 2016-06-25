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
