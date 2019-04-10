const debug = require("debug")("Blocks:Main")

import connect from "connect"
import path from "path"
import { pluginus } from "@asd14/pluginus"
import { is, pipe, map, forEach } from "@asd14/m"

import { BaseError } from "./errors/base"
import { NotFoundError } from "./errors/not-found"
import { InputValidationError } from "./errors/input"
import { AuthorizationError } from "./errors/authorization"

const createMiddlewarePipe = middleware => {
  const app = connect()

  for (let i = 0, length = middleware.length - 1; i <= length; i++) {
    app.use(middleware[i])
  }

  return app
}

const block = ({
  settings = {},
  plugins = [],
  routes = [],
  middleware: {
    beforeRoute = [],
    afterRoute = [],
    afterError = [],
    beforeSend = [],
  } = {},
} = {}) => {
  const props = {
    NAME: "blocksAPI",
    PORT: 8080,
    ENV: "development",
    CORS_ORIGIN: null,
    CORS_METHODS: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    STARTUP_TIME: new Date(),
    ...settings,
  }

  return pluginus({
    props,
  })([
    path.resolve(__dirname, "plugins", "config.js"),
    path.resolve(__dirname, "plugins", "router.js"),
    ...plugins,
  ]).then(ResolvedPlugins => {
    // add user defined routes to the Router plugin
    forEach(route => {
      ResolvedPlugins.Router.add({
        ...route,
        isAllowed: route.isAllowed(ResolvedPlugins),
        action: route.action(ResolvedPlugins),
      })
    })([require("./routes/ping.route.js"), ...routes])

    return {
      middlewarePipeline: pipe(
        map(middleware => middleware(ResolvedPlugins)),
        createMiddlewarePipe
      )([
        require("./middleware/req-bootstrap"),
        ...(is(props.CORS_ORIGIN) ? [require("./middleware/req-cors")] : []),
        require("./middleware/req-query"),
        require("./middleware/req-body"),
        require("./middleware/req-route-exists"),
        ...beforeRoute,
        require("./middleware/res-route"),
        ...afterRoute,
        require("./middleware/res-error"),
        ...afterError,
        require("./middleware/res-goodbye-error"),
        ...beforeSend,
        require("./middleware/res-goodbye"),
      ]),

      Plugins: ResolvedPlugins,
    }
  })
}

export {
  block,
  BaseError,
  AuthorizationError,
  InputValidationError,
  NotFoundError,
}
