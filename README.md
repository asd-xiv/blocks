<!-- markdownlint-disable line-length -->

# blocks

> Node.js API framework. You have a `request` and need to produce a `response`.

![Request-Response cycle](docs/bin/req-res-cycle.svg "Request-Response cycle")

--- 

<!-- vim-markdown-toc GFM -->

* [Features](#features)
* [Install](#install)
* [Basic example](#basic-example)
* [Routes](#routes)
  * [Default routes](#default-routes)
    * [Status check](#status-check)
    * [Prometheus data](#prometheus-data)
  * [Add route](#add-route)
* [Plugins](#plugins)
  * [Default plugins](#default-plugins)
    * [Config](#config)
  * [Add plugin](#add-plugin)
* [Develop](#develop)
* [Changelog](#changelog)
  * [0.6 - March 2019](#06---march-2019)
    * [Add](#add)

<!-- vim-markdown-toc -->

## Features

__Validate input__ - [`ajv`](https://github.com/epoberezkin/ajv)

> Pass request data (headers, body, query parameters, URL parameters) through custom JSON Schemas defined for each route. Make sure no unwanted data gets in, de-clutter the route logic and make the API behave more consistent.  
If validation fails, an automatic `409 Conflict` response will be sent to the client.

__Check permissions__

> Simple function outside of main route logic.  
If it returns false, an automatic `403 Forbidden` response will be sent to the client.

__Async support__

> Route actions, middleware and plugins support `async/await`.

__Query string parsing__ - [`qs`](https://github.com/ljharb/qs)

> Parsed data will be available on the `request.ctx` object.

__Cross-origin resource sharing__

> Using [`cors`](https://github.com/expressjs/cors)

## Install

```bash
npm install @leeruniek/blocks
```

## Basic example 

`src/index.js`

```javascript
const http = require("http")
const path = require("path")
const { block } = require("@leeruniek/blocks")

block({
  // settings: {
  //   METRICS: true,
  //   METRICS_NAMESPACE: "blocks",
  //   METRICS_WITH_DEFAULT: false,
  //   PORT: 8080,
  //   MICRO_VERSION: pkg.version,
  //   ENV: "development",
  //   CORS_ORIGIN: null,
  //   CORS_METHODS: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  // },

  // where plugins and routes are
  folders: path.resolve("./src"),

  // RegExp to match plugin files 
  // plugins: /\.plugins\.js$/,

  // RegExp to match routes files 
  // routes: /\.routes\.js$/,
}).then(({ Plugins: { Config }, middlewarePipeline }) =>
  http
    .createServer(middlewarePipeline)
    .listen(Config.get("PORT"), "localhost", () => {
      console.log(`### Started server on port ${Config.get("PORT")}`)
    })
)
```

## Routes

### Default routes

#### Status check

`GET: /ping` 
```js
{
  "ping": "pong",
  "aliveFor": {
    "days": 2, "hours": 1, "minutes": 47, "seconds": 46
  },
  "version": "0.5.6", // package.json version 
}
```

#### Prometheus data

`GET: /metrics` If server started with `METRICS: true`. 

### Add route

`src/something.route.js`

```js
module.exports = {
  method: "GET",
  path: "/something",

  // Data is valid then continue to permissionn check, otherwise return 409
  schema: require("./something.schema"),

  // Is allowed then continue to action, otherwise return 403
  isAllowed: (/* plugins */) => async ({ method, ctx }) => {
    console.log(`${method}:${ctx.pathname} - isAllowed`)

    return true
  },

  // Returned value will be set in `res` body 
  action: (/* plugins */) => async (/* req */) => {
    return {
      message: "This is something else!"
    }
  },
}
```

`src/something.schema.js`

```js
module.exports = {
  type: "object",
  properties: {
    headers: {
      type: "object",
    },

    params: {
      type: "object",
      additionalProperties: false,
    },

    query: {
      type: "object",
      additionalProperties: false,
    },

    body: {
      type: "object",
      additionalProperties: false,
    },
  },
}
```

See [`ajv`](https://github.com/epoberezkin/ajv) and [JSON Schema docs](https://json-schema.org) for more on data validation.

## Plugins

### Default plugins

#### Config

Getter over the settings object when instantiating `blocks`. Accessible in route's `isAllowed` and `action` methods and when defining custom middleware.

While you can use `process.env` to access CI variables globally, use this opportunity to write a few words about each.

`src/index.js`
```js
blocks({
  settings: {
    // (CI) Key to decrypt incoming json-web-tokens. See `jwt.middle.js` for details.
    JWT_SECRET: process.env.JWT_SECRET ?? "CHANGE ME!"
    ...
  },
  ...
})
```

`src/middleware/jwt.middle.js`
```js
module.exports = ({ Config }) => (req, res, next) => {
  ...
  jwt.verify(req.headers.authorization, Config.get("JWT_SECRET"))
  ...
}
```

### Add plugin

## Develop

```bash
git clone git@github.com:leeruniek/blocks.git && \
  cd blocks && \
  npm run setup

# run tests (any `*.test.js`) once
npm test

# watch `src` folder for changes and run test automatically
npm run tdd
```

## Changelog

History of all changes in [CHANGELOG.md](/CHANGELOG.md)

### 0.6 - March 2019

#### Add

- Diagrams and words describing how things work

