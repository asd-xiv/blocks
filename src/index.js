// const debug = require("debug")("blocks:Index")

import connect from "connect"
import path from "path"
import { pluginus } from "@asd14/pluginus"
import { is, forEach, reduce } from "@asd14/m"

const block = ({
  plugins: pluginPaths = [],
  routes = [],
  middleware: {
    beforeRoute = [],
    afterRoute = [],
    afterError = [],
    beforeSend = [],
  } = {},
} = {}) => {
  process.env.STARTUP_TIME = new Date()

  const __dirname = path.resolve()

  return pluginus({
    source: [
      path.resolve(__dirname, "src", "plugins", "router.js"),
      path.resolve(__dirname, "src", "plugins", "query-parser.js"),
      ...pluginPaths,
    ],
  }).then(plugins => {
    /*
     * Register routes
     */
    forEach(
      item => {
        const { authenticate, authorize, action, ...rest } =
          typeof item === "string" ? import(item) : item

        plugins.Router.add({
          ...rest,
          authenticate:
            typeof authenticate === "function"
              ? authenticate(plugins)
              : () => false,
          authorize:
            typeof authorize === "function" ? authorize(plugins) : () => false,
          action: action(plugins),
        })
      },
      ["./routes/ping.route.js", ...routes]
    )

    return [
      /*
       * Middleware `connect` pipeline
       */
      reduce(
        (accumulator, item) => {
          const middleware =
            typeof item === "string" ? require(item)(plugins) : item(plugins)

          return is(middleware) ? accumulator.use(middleware) : accumulator
        },
        connect(),
        [
          "./middleware/request-bootstrap",
          "./middleware/request-cors",
          "./middleware/request-route-exists",
          // "./middleware/req-jwt",
          "./middleware/request-query",
          "./middleware/request-body",
          ...beforeRoute,
          "./middleware/response-route",
          ...afterRoute,
          "./middleware/response-error",
          ...afterError,
          "./middleware/response-goodbye-error",
          ...beforeSend,
          "./middleware/response-helmet",
          "./middleware/response-goodbye",
        ]
      ),

      plugins,
    ]
  })
}

export { block }

export { BaseError } from "./errors/base.js"
export { InputError } from "./errors/input.js"
export { NotFoundError } from "./errors/not-found.js"
export { AuthorizationError } from "./errors/authorization.js"
export { AuthenticationError } from "./errors/authentication.js"
