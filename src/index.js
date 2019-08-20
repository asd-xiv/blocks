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
  plugins = [],
  routes = [],
  middleware: {
    beforeRoute = [],
    afterRoute = [],
    afterError = [],
    beforeSend = [],
  } = {},
} = {}) => {
  const ROUTE_PATHS = ["./routes/ping.route.js", ...routes]
  const PLUGIN_PATHS = [
    path.resolve(__dirname, "plugins", "config.js"),
    path.resolve(__dirname, "plugins", "router.js"),
    ...plugins,
  ]
  const MIDDLEWARE_PATHS = [
    "./middleware/req-bootstrap",
    "./middleware/req-jwt",
    "./middleware/req-cors",
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
    "./middleware/res-helmet",
    "./middleware/res-goodbye",
  ]

  return pluginus()(PLUGIN_PATHS).then(Plugins => {
    forEach(item => {
      const route = typeof item === "string" ? require(item) : item

      Plugins.Router.add({
        ...route,
        isAllowed: is(route.isAllowed) ? route.isAllowed(Plugins) : () => false,
        action: route.action(Plugins),
      })
    })(ROUTE_PATHS)

    return {
      middlewarePipeline: reduce((acc, item) => {
        const middle =
          typeof item === "string" ? require(item)(Plugins) : item(Plugins)

        return is(middle) ? acc.use(middle) : acc
      }, connect())(MIDDLEWARE_PATHS),

      Plugins,
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
