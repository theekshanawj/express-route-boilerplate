# express-route-boilerplate
Boilerplate code for an Express application which allows to write express routes/middlware easily and faster.

## How to add 

Install [express-route-bootstrap](https://www.npmjs.com/package/node-file-navigator)

```
npm i express-route-bootstrap
```

Add to your application
```
const initExpress = require('express-route-bootstrap');
```

## How to use 

Define the routes in your application as modules in `js` files. `FileName` will be a route in the application.

```js
// v1.js

const express = require('express');
const routes = express.Router();

router.get('/', (req, res) => { ... }); //  GET /v1/
router.post('/', (req, res) => { ... }); // POST /v1/
router.get('/version', (req, res) => { ... }); // GET /v1/version/

module.exports = routes;

//root.js 

const express = require('express');
const routes = express.Router();

router.get('/', (req, res) => { ... });

module.exports = routes'

...

```

Define application level middlwares

```js
// logger.js

const logger = (req, res, next) => {
  // Logging
  next();
}

module.exports = { logger };

// auth.js

const auth = (req, res, next) => { ... }

const validate = (req, res, next) => { ... }

module.exports = { auth, validate };
```

Place the routes and middleware in separate directories (example given below)

```js
.
├── routes
│   ├── root.js
│   ├── v1.js
├── middleware
│   ├── logger.js
│   ├── auth.js
├── index.js
.
.
.
```

In the `entrypoint` file, invoke the module

```
// index.js 

const initExpress = require('express-route-bootstrap'); // Import

....


initExpress({ pathToRoutes: './routes/', pathToMiddleware: './middleware/',
    port: 5000, listenCallback: () => {console.log('app started')}}); // Invoke

```

## API Reference

### Method invocation

```
initExpress({ pathToRoutes, pathToMiddleware, rootRouteName, port, listenCallback });
```

### Parameters

| Parameter | Type | Required (default) | Usage | Example |
| --- | --- | --- | --- | --- |
| pathToRoutes | `string` | `yes` (`N/A`) | Relative path from root of the application to routes directory | `./routes/` |
| pathToMiddleware | `string` |  `no` (`N/A`) |Relative path from root of the application to middlware directory | `./middlware/`|
| rootRouteName | `string` | `no` (`root`) | Routes define in this file will become root (/) level routes without fileName prefix | `root`|
| port |  `number` | `no` (`3000`) | Port the application should run in | `5000` |
| listenCallback | `function` | `no` | Callback to be passed to `express().listen` | `() => { console.log('App started');`

### IMPORTANT 

Make sure `pathToRoutes` and `pathToMiddleware` has ending `/` charater as given in example above.
