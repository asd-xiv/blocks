<!-- markdownlint-disable line-length -->
[![npm package version](https://badge.fury.io/js/%40asd14%2Fblocks.svg)](https://badge.fury.io/js/%40asd14%2Fblocks)
[![Coverage Status](https://coveralls.io/repos/github/asd14/blocks/badge.svg)](https://coveralls.io/github/asd14/blocks)

# blocks

> A Node.js API framework

<!-- MarkdownTOC levels="1,2,3" autolink="true" indent="  " -->

- [Install](#install)
- [Use](#use)
  - [Default plugins](#default-plugins)
- [Develop](#develop)
- [Changelog](#changelog)
  - [0.2.0 - 18 November 2018](#020---18-november-2018)

<!-- /MarkdownTOC -->

## Install

```bash
npm i --save-exact @asd14/blocks
```

## Use

```javascript
const http = require("http")
const path = require("path")
const dotenv = require("dotenv")
const { block } = require("@asd14/blocks")

block({
  // settings: {
  //   APP_PORT: 8080,
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
    .listen(Config.get("APP_PORT"), "localhost", () => {
      console.log(`### Started server on port ${Config.get("APP_PORT")}`)
    })
)
```

### Default plugins

## Develop

```bash
git clone git@github.com:asd14/blocks.git && \
  cd blocks && \
  npm run setup

# run tests (any `*.test.js`) once
npm test

# watch `src` folder for changes and run test automatically
npm run tdd
```

## Changelog

History of all changes in [CHANGELOG.md](/CHANGELOG.md)

### 0.2.0 - 18 November 2018

#### Add

- Add basic [`tests`](/src/index.test.js)

#### Change

- Enable CORS middleware only if CORS_ORIGIN is not null
- Expose Base, Auth, Input and NotFound errors
