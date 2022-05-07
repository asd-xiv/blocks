import connect from "connect"
import path from "path"
import { pluginus } from "@asd14/pluginus"
import { is, forEach, reduce, type } from "@asd14/m"

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
      // path.resolve("./plugins/router.js"),
      // path.resolve("./plugins/query-parser.js"),
      path.resolve(__dirname, "src", "plugins", "router.js"),
      path.resolve(__dirname, "src", "plugins", "query-parser.js"),
      ...pluginPaths,
    ],
  }).then(plugins => {
    /*
     * Register routes
     */
    forEach(
      async item => {
        const imported = await (typeof item === "string" ?  import(item) : item)
        const { default: { authenticate, authorize, action, ...rest } } = imported

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
        async (accumulator, item) => {
          const source = await import(item)

          const middleware =
            typeof item === "string" ? source.default(plugins) : item(plugins)

          return is(middleware) ? accumulator.use(middleware) : accumulator
        },
        connect(),
        [
          "./middleware/request-bootstrap.js",
          "./middleware/request-cors.js",
          "./middleware/request-route-exists.js",
          // "./middleware/req-jwt.js",
          "./middleware/request-query.js",
          "./middleware/request-body.js",
          ...beforeRoute,
          "./middleware/response-route.js",
          ...afterRoute,
          "./middleware/response-error.js",
          ...afterError,
          "./middleware/response-goodbye-error.js",
          ...beforeSend,
          "./middleware/response-helmet.js",
          "./middleware/response-goodbye.js",
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
