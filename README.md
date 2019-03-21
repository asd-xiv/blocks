<!-- markdownlint-disable line-length -->

# blocks

> Node.js API framework. You have a `request` and need to produce a `response`.

![Request-Response cycle](docs/bin/req-res-cycle.svg "Request-Response cycle")

--- 

<!-- vim-markdown-toc GFM -->

* [Features](#features)
* [Routes](#routes)
  * [Add route](#add-route)
  * [Default routes](#default-routes)
    * [Alive](#alive)
    * [Metrics](#metrics)
* [Plugins](#plugins)
  * [Add plugin](#add-plugin)
  * [Default plugins](#default-plugins)
* [Install](#install)
* [Todos CRUD example](#todos-crud-example)
* [No support](#no-support)
* [Develop](#develop)
* [Changelog](#changelog)
  * [0.6 - March 2019](#06---march-2019)
    * [Add](#add)
    * [Change](#change)

<!-- vim-markdown-toc -->

## Features

__Route input validation__ - [`ajv`](https://github.com/epoberezkin/ajv)

> Pass request data (headers, body, query parameters, URL parameters) through custom JSON Schemas defined for each route. Make sure no unwanted data gets in, de-clutter the route logic and make the API behave more consistent.  
If validation fails, an automatic `409 Conflict` response will be sent to the client.

__Route permission checking__

> Simple function outside of main route logic. If it returns false, an automatic `403 Forbidden` response will be sent to the client.

__Query string parsing__ - [`qs`](https://github.com/ljharb/qs)

> Parsed data will be available on the `request.ctx` object.

__Cross-origin resource sharing__

> Using [`cors`](https://github.com/expressjs/cors)

## Routes

### Add route

### Default routes

#### Alive

`GET: /ping` A status check endpoint to know when the API is alive.

```js
{
  "ping": "pong",
  "aliveFor": {
    "days": 2, "hours": 1, "minutes": 47, "seconds": 46
  },
  "version": "0.5.6", // package.json version 
}
```

#### Metrics

`GET: /metrics` If server started with `METRICS: true`, a route will be exposed with Prometheus data waiting to be consumed.

## Plugins

### Add plugin

### Default plugins

## Install

```bash
npm install @leeruniek/blocks
```

## Todos CRUD example 

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

  // RegExp to match & load plugin files 
  // plugins: /\.plugins\.js$/,

  // RegExp to match & load routes files 
  // routes: /\.routes\.js$/,
}).then(({ Plugins: { Config }, middlewarePipeline }) =>
  http
    .createServer(middlewarePipeline)
    .listen(Config.get("PORT"), "localhost", () => {
      console.log(`### Started server on port ${Config.get("PORT")}`)
    })
)
```

## No support

1. JWT parsing. Add through custom middleware
1. Database. Add through custom plugin

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

- Diagrams and word describing how thing work

#### Change

