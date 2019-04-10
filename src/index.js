const debug = require("debug")("Blocks:Main")

import connect from "connect"
import path from "path"
import { pluginus } from "@asd14/pluginus"
import { is, forEach, reduce } from "@asd14/m"

import { BaseError } from "./errors/base"
import { NotFoundError } from "./errors/not-found"
import { InputValidationError } from "./errors/input"
import { AuthorizationError } from "./errors/authorization"

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
  ]).then(resolvedPlugins => {
    // Add routes to Router plugin
    forEach(item => {
      const route = typeof item === "string" ? require(item) : item

      resolvedPlugins.Router.add({
        ...route,
        isAllowed: route.isAllowed(resolvedPlugins),
        action: route.action(resolvedPlugins),
      })
    })(["./routes/ping.route.js", ...routes])

    return {
      middlewarePipeline: reduce((acc, item) => {
        const middle = typeof item === "string" ? require(item) : item

        return acc.use(middle(resolvedPlugins))
      }, connect())([
        "./middleware/req-bootstrap",
        ...(is(props.CORS_ORIGIN) ? ["./middleware/req-cors"] : []),
        "./middleware/req-query",
        "./middleware/req-body",
        "./middleware/req-route-exists",
        ...beforeRoute,
        "./middleware/res-route",
        ...afterRoute,
        "./middleware/res-error",
        ...afterError,
        "./middleware/res-goodbye-error",
        ...beforeSend,
        "./middleware/res-goodbye",
      ]),

      Plugins: resolvedPlugins,
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
