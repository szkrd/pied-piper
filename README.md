# pied-piper

Transparent, aggressive api cache/proxy.

* __WIP__
* dump server responses
* respond with fake data
* high level (valid JSON only)
* no etags

## usage

Instead of calling your `/api/stuff`, you call __/test/proxy/__`api/stuff`
where "test" is the db target.
