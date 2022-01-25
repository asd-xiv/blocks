const debug = require("debug")("blocks:Index")

const connect = require("connect")
const path = require("path")
const { pluginus } = require("@asd14/pluginus")
const { is, forEach, reduce } = require("@asd14/m")

const { BaseError } = require("./errors/base.js")
const { NotFoundError } = require("./errors/not-found.js")
const { InputError } = require("./errors/input.js")
const { AuthenticationError } = require("./errors/authentication.js")
const { AuthorizationError } = require("./errors/authorization.js")

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

  return pluginus({
    source: [
      path.resolve(__dirname, "plugins", "router.js"),
      path.resolve(__dirname, "plugins", "query-parser.js"),
      ...pluginPaths,
    ],
  }).then(plugins => {
    /*
     * Register routes
     */
    forEach(
      item => {
        const { authenticate, authorize, action, ...rest } =
          typeof item === "string" ? require(item) : item

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

module.exports = {
  block,
  BaseError,
  InputError,
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
}
