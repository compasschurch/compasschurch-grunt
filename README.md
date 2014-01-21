elgg-grunt
===================

Shared grunt configuration for Elgg 2.0 plugins and sites.

Usage
-----

### 1. Put this as your project's Gruntfile.js:

```js
module.exports = require('elgg-grunt');
```

### 2. Add a profiles.local.json
Your local server needs to point to the /dist/ directory,
which is where the built files will end up.

```json
{
  "baseUrl": "http://localhost:8080/dist/"
}
```

### 3. Run `grunt`
Just `grunt`; no flags or subcommands.

This gives you the default local build.
Load up the app at baseUrl to see it in action!
NB: You need to start the server yourself.
How to do that is different based on each environment.

TODO(evan): Provide a default local server.

Releasing
---------
This project and any project that relies on this one to provide
its Gruntfile configuration can use the following commands to
quickly push new versions to NPM.

```sh
# Bugfix releases (e.g. 1.0.x)
grunt release:patch
npm publish

# New feature releases (e.g. 1.x.0)
grunt release:minor
npm publish

# Backwards-incompatible releases (e.g. x.0.0)
grunt release:major
npm publish
```

Each of these will generate the appropriate changelog updates
assuming you have been diligent to adhere to the recommended
[commit message format][1].

 [1]: https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit
