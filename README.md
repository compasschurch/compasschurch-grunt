compasschurch-grunt
===================

Shared grunt configuration for CBC sites


Usage
-----

### 1. Put this as your project's Gruntfile.js:

```js
module.exports = function(grunt) {
    grunt.loadNpmTasks('compasschurch-grunt');
    require('compasschurch-grunt')(grunt);
};
```

### 2. Add a profiles.local.json

```json
{
  "baseUrl": "http://localhost:8080/dist/"
}
```

### 3. Run `grunt`

This gives you the default local build.
You need to run the server yourself.
Load up the app at baseUrl to see it in action!