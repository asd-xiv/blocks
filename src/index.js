const debug = require("debug")("Blocks:Main")

import connect from "connect"
import path from "path"
import { pluginus } from "@mutant-ws/pluginus"
import { is, forEach, reduce } from "@mutant-ws/m"

import { BaseError } from "./errors/base"
import { NotFoundError } from "./errors/not-found"
import { InputValidationError } from "./errors/input"
import { AuthorizationError } from "./errors/authorization"

const block = ({
  plugins = [],
  routes = [],
  middleware: {
    beforeRoute = [],
    afterRoute = [],
    afterError = [],
    beforeSend = [],
  } = {},
} = {}) => {
  process.env.STARTUP_TIME = new Date()

  const ROUTE_PATHS = ["./routes/ping.route.js", ...routes]
  const PLUGIN_PATHS = [
    path.resolve(__dirname, "plugins", "router.js"),
    path.resolve(__dirname, "plugins", "query-parser.js"),
    ...plugins,
  ]
  const MIDDLEWARE_PATHS = [
    "./middleware/req-bootstrap",
    "./middleware/req-cors",
    "./middleware/req-route-exists",
    "./middleware/req-jwt",
    "./middleware/req-query",
    "./middleware/req-body",
    ...beforeRoute,
    "./middleware/res-route",
    ...afterRoute,
    "./middleware/res-error",
    ...afterError,
    "./middleware/res-goodbye-error",
    ...beforeSend,
    "./middleware/res-helmet",
    "./middleware/res-goodbye",
  ]

  return pluginus({ files: PLUGIN_PATHS }).then(Plugins => {
    forEach(item => {
      const route = typeof item === "string" ? require(item) : item

      Plugins.Router.add({
        ...route,
        isAllowed: is(route.isAllowed) ? route.isAllowed(Plugins) : () => false,
        action: route.action(Plugins),
      })
    })(ROUTE_PATHS)

    return [
      // middleware
      reduce((acc, item) => {
        const middle =
          typeof item === "string" ? require(item)(Plugins) : item(Plugins)

        return is(middle) ? acc.use(middle) : acc
      }, connect())(MIDDLEWARE_PATHS),

      // plugins
      Plugins,
    ]
  })
}

export {
  block,
  BaseError,
  AuthorizationError,
  InputValidationError,
  NotFoundError,
}
