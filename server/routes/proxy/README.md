proxy
=====

The purpose of the project, transparently proxy calls from
remote endpoint to local client.

----

/:project/proxy/*
-----------------

The main proxy api endpoint. Anything directed here will be
proxied transparently forward to the _env.TARGET_ url.

### GET, POST, PUT, PATCH, DELETE 

#### params schema

* __project__: string, lowercase, token, max: 64

#### response

Remote payload.

* gzipped content will be extracted
* cert errors will be swallowed
* no body may be replaced with empty body (resulting in status 204)
