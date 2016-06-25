# pied-piper

Transparent, aggressive api cache/proxy.

* __WIP__
* dump server responses
* respond with fake data
* high level (valid JSON only)
* no etags

## usage

Instead of calling your `/api/stuff`, you call __/test/proxy/__`api/stuff`
where "test" is the current project.

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
