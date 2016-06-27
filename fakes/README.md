# fakes

Fakes will override server responses.
Proxy will NOT call the server if an appropriate fake has been found.

* filenames: `project.js` for `/project/proxy`, `example.js` for `/example/proxy` etc.
* js files are required __ONCE__ during app startup
* for structure see [example.js](./example.js)
