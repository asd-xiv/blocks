import connect from "connect"
import path from "path"
import { pluginus } from "@asd14/pluginus"
import { is, reduce, map } from "@asd14/m"

const block = async ({
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

  const plugins = await pluginus({
    source: [
      path.resolve(__dirname, "src", "plugins", "router.js"),
      path.resolve(__dirname, "src", "plugins", "query-parser.js"),
      ...pluginPaths,
    ],
  })

  /*
   * Register routes
   */
  await Promise.all(
    map(
      async item => {
        const imported = await (typeof item === "string" ? import(item) : item)
        const {
          default: { authenticate, authorize, action, schema = {}, ...rest },
        } = imported
        const _schema =
          is(schema.default) && !is(schema.headers) ? schema.default : schema

        plugins.Router.add({
          ...rest,
          schema: _schema,
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
  )

  const middlewarePaths = [
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

  const middlewares = await Promise.all(
    map(
      item =>
        import(item).then(input =>
          typeof item === "string" ? input.default(plugins) : item(plugins)
        ),
      middlewarePaths
    )
  )

  return [
    /*
     * Middleware `connect` pipeline
     */
    reduce(
      (accumulator, item) => (is(item) ? accumulator.use(item) : accumulator),
      connect(),
      middlewares
    ),

    plugins,
  ]
}

export { block }

export { BaseError } from "./errors/base.js"
export { InputError } from "./errors/input.js"
export { NotFoundError } from "./errors/not-found.js"
export { AuthorizationError } from "./errors/authorization.js"
export { AuthenticationError } from "./errors/authentication.js"
