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
