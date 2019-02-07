<!-- markdownlint-disable line-length -->

# blocks

> A Node.js API framework


<!-- vim-markdown-toc GFM -->

* [Install](#install)
* [Use](#use)
  * [Default plugins](#default-plugins)
* [Develop](#develop)
* [Changelog](#changelog)
  * [0.5.4 - 7 February 2019](#054---7-february-2019)
    * [Change](#change)

<!-- vim-markdown-toc -->

## Install

```bash
npm i --save-exact @leeruniek/blocks
```

## Use

```javascript
const http = require("http")
const path = require("path")
const { block } = require("@leeruniek/blocks")

block({
  // settings: {
  //   PORT: 8080,
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

### Default plugins

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

### 0.5.4 - 7 February 2019

#### Change

- JSON stringify based on route response type 
