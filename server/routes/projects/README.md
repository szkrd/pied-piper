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
