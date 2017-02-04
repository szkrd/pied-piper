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
