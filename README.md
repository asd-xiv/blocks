<!-- markdownlint-disable first-line-h1 line-length -->

[![CircleCI](https://circleci.com/gh/asd-xiv/blocks.svg?style=svg)](https://circleci.com/gh/asd-xiv/blocks)
[![npm package version](https://badge.fury.io/js/%40asd14%2Fblocks.svg)](https://badge.fury.io/js/%40asd14%2Fblocks)
[![Coverage Status](https://coveralls.io/repos/github/asd-xiv/blocks/badge.svg)](https://coveralls.io/github/asd-xiv/blocks)

# blocks

> REST API framework for Node.js

![Request-Response cycle](docs/bin/req-res-cycle.svg "Request-Response cycle")

---

<!-- vim-markdown-toc GFM -->

- [Features](#features)
  - [Validate input](#validate-input)
  - [Permissions](#permissions)
  - [Plugin / Dependency Injection](#plugin--dependency-injection)
  - [Promises](#promises)
  - [Other](#other)
- [Install](#install)
- [Example](#example)
- [Configuration](#configuration)
- [Routes](#routes)
  - [Default "/ping"](#default-ping)
  - [Definition](#definition)
  - [JSON schemas](#json-schemas)
  - [Data formats](#data-formats)
- [Plugins](#plugins)
  - [Custom plugin](#custom-plugin)
- [Develop](#develop)
- [Changelog](#changelog)

<!-- vim-markdown-toc -->

## Features

### Validate input

> Pass request data (headers, body, query parameters, URL parameters) through
> custom JSON Schemas defined for each route. Make sure no unwanted data gets
> in, de-clutter the route logic and make the API behave more consistent.  
> If validation fails, an automatic `409 Conflict` response will be sent.

### Permissions

> Function outside of main route logic. If it returns false, an automatic
> `403 Forbidden` response will be sent.

### Plugin / Dependency Injection

> Separate 3rd party systems logic or splitting code for better
> [SOC](https://en.wikipedia.org/wiki/Separation_of_concerns)

### Promises

> `async/await` in Plugins and Routes

### Other

- File upload and form parsing for `multipart/form-data` -
  [`busboy`](https://github.com/mscdex/busboy)
- Middleware support of existing package -
  [`connect`](https://github.com/senchalabs/connect)
- JSON Web Token - [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken)
- Query string parsing - [`qs`](https://github.com/ljharb/qs)
- Route parameter parsing -
  [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp)
- Cross-origin resource sharing - [`cors`](https://github.com/expressjs/cors)
- Secure your API with various HTTP headers -
  [`helmet`](https://github.com/helmetjs/helmet)

## Install

```bash
npm install @asd14/blocks
```

## Example

`src/index.js`

```js
import http from "node:http"
import glob from "glob"
import { block } from "@asd14/blocks"

const [middleware] = await block({
  plugins: glob.sync("./plugins/*.js", { absolute: true }),
  routes: glob.sync("./**/*.route.js", { absolute: true }),
})

http
  .createServer(middleware)
  .listen(process.env.PORT)
  .on("error", error => {
    console.log("Server error", error)
  })
  .on("listening", () => {
    console.log(`Server started on port ${process.env.PORT}`)
  })

```

## Configuration

`blocks` uses a set of `process.env` variables for configuration. See
[`_env`](_env) file for all available options and defaults.

Use [`dotenv`](https://github.com/motdotla/dotenv) for easy local development.

## Routes

### Default "/ping"

`GET: /ping`

```js
{
  "name": "@asd14/blocks",
  "ping": "pong",
  "aliveFor": {
    "days": 2, "hours": 1, "minutes": 47, "seconds": 46
  }
}
```

### Definition

`src/something.route.js`

```js
import schema from "./something.schema.js"

export default {
  method: "GET",
  path: "/something/:id",

  /**
   * Check "req.query", "req.header", "req.params" and "req.body"
   * against a JSON Schema. If check fails, respond with 409,
   * otherwise continue to ".authenticate".
   */
  schema,

  /**
   * Check for valid JWT.
   *
   * @param {object} plugins
   *
   * @returns {(object) => Promise<boolean>}
   * If false, responds with 401, otherwise continue to ".authorize".
   */
  authenticate: (/* plugins */) => (/* req */) => true,

  /**
   * Check if is allowed to access underlying resource.
   *
   * @param {object} plugins
   *
   * @returns {(object) => Promise<boolean>}
   * If false, respond with 403, otherwise continue to ".action".
   */
  authorize: (/* plugins */) => (/* req */) => true,

  /**
   * Route/Controller logic
   *
   * @param {object} plugins
   *
   * @returns {(object) => Promise<*>} 500 if throws, 201 if POST, 200 otherwise
   */
  action: (/* plugins */) => req => {
    return {
      message: req.ctx.params.id,
    }
  },
}
```

### JSON schemas

Input validation is the first step in the processing pipeline. It's meant to
validate that incoming data corresponds with what the route expects in order to
do it's job properly. See [`ajv`](https://github.com/epoberezkin/ajv) and
[JSON Schema docs](https://json-schema.org) for more on data validation.

Schemas can contain only 4 (optional) keys. Each key must be a
[ajv](https://github.com/epoberezkin/ajv) compatible object.

- `headers` validates `req.headers`
- `params` validates `req.ctx.params` parsed from URL with
  [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp)
- `query`: validates `req.ctx.query` parsed from URL with
  [`qs`](https://github.com/ljharb/qs)
- `body` validates `req.ctx.body` parsed from `req` with `JSON.parse`

See [`src/plugins/route-default.schema.js`](src/plugins/route-default.schema.js)
for default values.

`src/something.schema.js`

```js
export default {
  headers: {
    type: "object",
    required: ["authorization"],
    properties: {
      authorization: {
        type: "string",
      },
    },
  },

  params: {
    type: "object",
    additionalProperties: false,
    required: ["id"],
    properties: {
      id: {
        type: "string",
        pattern: "^[a-z0-9-]+$",
        maxLength: 25,
        minLength: 25,
      },
    },
  },

  query: {
    type: "object",
    additionalProperties: false,
    properties: {
      offset: {
        type: "integer",
        minimum: 0,
        default: 0,
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 100,
        default: 20,
      },
    },
  },
}
```

### Data formats

- _date_: full-date according to
  [RFC3339](http://tools.ietf.org/html/rfc3339#section-5.6)
- _time_: time with optional time-zone
- _date-time_: date-time from the same source (time-zone is mandatory)
- _duration_: duration from
  [RFC3339](https://tools.ietf.org/html/rfc3339#appendix-A)
- _uri_: full URI
- _email_: email address
- _ipv4_: IP address v4
- _ipv6_: IP address v6
- _regex_: tests whether a string is a valid regular expression by passing it to
  RegExp constructor
- _uuid_: Universally Unique IDentifier according to
  [RFC4122](http://tools.ietf.org/html/rfc4122)

```js
{
  "params": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "id": {
        "type": "string",
        "format": "uuid"
      }
    }
  },

  "query": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "email": {
        "type": "string",
        "format": "email"
      }
    }
  },

  "body": {
    "type": "object",
    "additionalProperties": false,
    "properties": {
      "thumbnailURL": {
        "type": "string",
        "format": "uri"
      },
      "createdAt": {
        "type": "string",
        "format": "date-time"
      }
    }
  }
}
```

## Plugins

Separate code interfacing with 3rd party libraries or services.
[pluginus](https://github.com/asd-xiv/pluginus) dependency injection library is
used.

Plugins are accessible in other plugins, middleware and routes.

### Custom plugin

A plugin consists of a constructor function and a list of other plugins that is
dependent on.

Whatever the `create` function returns will be considered as the plugin's
content and is what will be exposed to the routes, middleware and other plugins.

`src/plugins/database.js`

```js
import Sequelize from "sequelize"

export default {
  /**
   * Array of plugins to wait for before running `create`.
   * Name is constructed from the filename by removing the extension and
   * turning it into CammelCase.
   *
   * Ex. "test__name--BEM.plugin.js" => "TestNameBemPlugin"
   */
  depend: ["Lorem"],

  /**
   * Constructor, return value will be considered the plugin's content exposed
   * to routes, middleware and other plugins.
   *
   * @returns  {Promise<any>}  Plugin content
   */
  create: => Lorem => {
    console.log("Checking DB connection")

    // Database connection, model loading etc
    ...
    return {
      Todos: ...,
      Comments: ...,
    }
  }
}
```

## Develop

```bash
git clone git@github.com:asd-xiv/blocks.git && \
  cd blocks && \
  npm run setup
```

Run all `*.test.js` in `tests` folder

```bash
npm test
```

Watch `src` and `tests` folders and re-run tests

```bash
npm run tdd
```

## Changelog

See the [releases section](https://github.com/asd-xiv/blocks/releases) for
details.
