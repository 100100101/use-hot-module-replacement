## Based on https://github.com/sidorares/hot-module-replacement

-   Module rewritten in TypeScript
-   If you save the file twice within 500ms, the reboot will be cancelled. This is done so that you can run prettier without rebooting.

# hot-module-replacement

Hot module replacement for Node.js

This module tries to mimic [webpack HMR](https://webpack.js.org/api/hot-module-replacement/) API

## Installation

```js
  cd your-project-root/utils
  git clone https://github.com/100100101/use-hot-module-replacement.git
```

Add to your-project-root/package.json

```
{
  ...
  "dependencies": {
    ...
    "use-hot-module-replacement": "link:utils/use-hot-module-replacement"
    ...
  },
  ...
}
```

## Usage

Put this code somewhere in your code to initialise hot reload

```js
import useHotModuleReplacement from 'use-hot-module-replacement'
useHotModuleReplacement({
    // options are optional
    ignore: /node_modules/, // regexp to decide if module should be ignored; also can be a function accepting string and returning true/false
    doubleSaveDiscardMs: 500, // default 500 / -1 - is disable
})
```

You need to explicitly mark any subtree as 'hot reloadable' by calling `hot.accept()`

```js
let foo = require('./util/foo.js')

module.hot?.accept('./util/foo', () => {
    // if foo.js or any files that foo.js depend on are modified this callback is invoked
    foo = require('./util/foo.js') // by this time module cache entry for 'foo' already cleaned and module reloaded, requiring again is the easiest way of geting reference to new module. We need to assign it to local foo variable to make our local code in this file aware of it.
})
```

## Similar projects:

-   https://github.com/yyrdl/dload ( forces you to use own module api for replaceables modules )
-   https://github.com/rlindskog/solit ( transpiles all files on start )
-   https://github.com/fgnass/node-dev

### webpack hmr on the server

-   https://github.com/palmerhq/backpack
-   https://hackernoon.com/hot-reload-all-the-things-ec0fed8ab0
-   https://github.com/jaredpalmer/razzle
-   https://github.com/jlongster/backend-with-webpack ( and http://jlongster.com/Backend-Apps-with-Webpack--Part-III )
