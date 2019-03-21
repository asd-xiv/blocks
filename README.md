<!-- markdownlint-disable line-length -->

# blocks

> A Node.js API framework

<!-- vim-markdown-toc GFM -->

* [Install](#install)
* [About](#about)
  * [Default routes](#default-routes)
  * [Main libraries used](#main-libraries-used)
  * [Defining a new route](#defining-a-new-route)
  * [Default plugins](#default-plugins)
    * [Config](#config)
    * [Prometheus](#prometheus)
* [Todos CRUD example](#todos-crud-example)
* [Develop](#develop)
* [Changelog](#changelog)
  * [0.6 - March 2019](#06---march-2019)
    * [Add](#add)
    * [Change](#change)

<!-- vim-markdown-too -->

## Install

```bash
npm install @leeruniek/blocks
```

## About

You have a `request` and need to produce a `response`. To achieve this tremendous task, Blocks will __(1)__ validate that the request is clean by running the headers, query, body and URL param data through a set of JSON schemas and __(2)__ check if the client doing the request is allowed access. Both things are configurable per route.

There is build in support _query parsing_ and _CORS_.

![Request-Response cycle](docs/bin/req-res-cycle.svg "Request-Response cycle")

## Routes

## Add route

## Default routes

### `GET: /ping`

A status check endpoint to know when the API is alive.

```js
{
  "ping": "pong",
  "aliveFor": {
    "days": 2, "hours": 1, "minutes": 47, "seconds": 46
  },
  "version": "0.5.6", // package.json version 
}
```

### `GET: /metrics`

If server started with `METRICS: true`, a route will be exposed with Prometheus data waiting to be consumed.

## Plugins

### Config plugin

### Prometheus plugin

## Main libraries used

1. [`qs`](https://github.com/ljharb/qs) - Query parameter parsing
1. [`ajv`](https://github.com/epoberezkin/ajv) - JSON Schema validation
1. [`cors`](https://github.com/expressjs/cors) - Cross-origin resource sharing 

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

