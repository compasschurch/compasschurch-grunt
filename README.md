compasschurch-grunt
===================

Shared grunt configuration for CBC sites


Usage
-----

### 1. Put this as your project's Gruntfile.js:

```js
module.exports = require('compasschurch-grunt');
```

### 2. Add a profiles.local.json

```json
{
  "baseUrl": "http://localhost:8080/dist/"
}
```

### 3. Run `grunt`

This gives you the default local build.
Load up the app at baseUrl to see it in action!
NB: You need to start the server yourself.
How to do that is different based on each environment.
