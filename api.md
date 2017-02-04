config
======

Runtime configuration for the admin client.

----

/api/config
-----------

### GET

Returns a runtime config object.

```json
{
  "preFlight": {
    "env": "development",
    "port": 3100,
    "target": "https://jsonplaceholder.typicode.com"
  },
  "fakes": [
    "example"
  ],
  "strict": false,
  "recording": true,
  "active": true,
  "dump": true,
  "sleep": 0,
  "retryLockTimeout": 0,
  "disabledProjects": [ "project-foo" ]
}
```

* __preFlight__: pre-startup env vars and parameters
* __fakes__: active interceptors, see "fakes" directory for examples
* __strict__: match with request body, not just request method and uri
* __recording__: save response to db?
* __active__: if not active, will always request from remote party; global sleep may still be active
* __dump__: save json files on server into dumps folder
* __sleep__: global sleep in sec; affects all requests, use it to simulate slow responses. Blocking via yield/await.
* __retryLockTimeout__: sec; affects all requests, use it to protect remote server from accidental flooding on response 408.
* __disabledProjects__: list of deactivated projects (they are still in the db)

### PUT

Modify runtime config.

#### body schema

* __strict__: boolean
* __active__: boolean
* __recording__: boolean
* __dump__: boolean
* __sleep__: number, integer, max: 10
* __retryLockTimeout__: number, integer, max: 10
* __disabledProjects__: array of (string, lowercase, token, max: 64)

----

/api/config/toggle-project/:project
-----------------------------------

### params schema

* __project__: string, lowercase, token, max: 64

### PUT

Toggle project. Accepts empty payload. 
Returns empty body on success.

projects
========

Projects are containers. You can create "projectfoo" by calling
pied piper proxy through _http://pied-piper.dev:3100/project-foo/proxy_.

Project names may contain alphanumeric characters and underscores _only_.

----

/api/projects
-------------

### GET
 
Returns a list of project names.

#### response

```json
["foo", "bar", "baz"]

```

----

/api/projects/:project
----------------------

### params schema

* __project__: string, lowercase, token, max: 64

### DELETE

Delete project by name, destroy collection in database.
Returns empty body on success.

proxied resources
=================

Proxied resources are the responses recorded in the db.
They may be retrieved, modified or deleted.

----

/api/proxied-resources/:project
-------------------------------

### params schema

* __project__: string, lowercase, token, max: 64

### GET

Get a list of resources. Response is an array of proxied resource objects.

### DELETE

Flush all items. Returns empty body on success.

----

/api/sse/proxied-resources/:project
-----------------------------------

Server side events (SSE). Streaming endpoint.

### GET

Gets a new proxied resource object.

----

/api/proxied-resource/:project/:id
----------------------------------

### GET

Disabled and sleep are optional, _id is mongo id.

```json
{
  "_id": "5895c2d67334cc413176f0ec",
  "disabled": true,
  "sleep": 3,
  "lastModified": "2017-02-04T12:02:30.687Z",
  "request": {
    "body": { /*...*/ },
    "headers": { /*...*/ },
    "method": "GET",
    "target": "/posts",
    "uri": "https://jsonplaceholder.typicode.com/posts"  
  },
  "response": {
    "headers": { /*...*/ },
    "statusCode": 200,
    "body": { /*...*/ }
  }
}
```

### PUT

Modify a stored resource object. Returns empty body on success.

#### body schema

* __sleep__: number, integer, max: 10
* __disabled__: boolean
* __request__: object
  * __method__: string, uppercase, valid: GET, POST, PUT, PATCH, DELETE
  * __uri__: string, uri: http & https
  * __target__: string,
  * __body__: object / array / null
  * __headers__: object
* __response__: object
  * __body__: object / array / null
  * __headers__: object
  * __status__: number, integer, min: 100, max: 600


### DELETE

Deletes resource from db. Returns empty body on success.

----

/api/proxied-resource/toggle/:project/:id
-----------------------------------------

### params schema

* __project__: string, lowercase, token, max: 64
* __id__: string, 24 char mongo-id

### PUT

Returns empty body on success.

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
