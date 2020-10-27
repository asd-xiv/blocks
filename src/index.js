const debug = require("debug")("blocks:Index")

const connect = require("connect")
const path = require("path")
const { pluginus } = require("@asd14/pluginus")
const { is, forEach, reduce } = require("@asd14/m")

const { BaseError } = require("./errors/base")
const { NotFoundError } = require("./errors/not-found")
const { InputError } = require("./errors/input")
const { AuthenticationError } = require("./errors/authentication")
const { AuthorizationError } = require("./errors/authorization")

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

  return pluginus({
    source: [
      path.resolve(__dirname, "plugins", "router.js"),
      path.resolve(__dirname, "plugins", "query-parser.js"),
      ...plugins,
    ],
  }).then(resolvedPlugins => {
    /*
     * Register routes
     */
    forEach(
      item => {
        const { authenticate, authorize, action, ...rest } =
          typeof item === "string" ? require(item) : item

        resolvedPlugins.Router.add({
          ...rest,
          authenticate:
            typeof authenticate === "function"
              ? authenticate(resolvedPlugins)
              : () => false,
          authorize:
            typeof authorize === "function"
              ? authorize(resolvedPlugins)
              : () => false,
          action: action(resolvedPlugins),
        })
      },
      ["./routes/ping.route.js", ...routes]
    )

    return [
      /*
       * Middleware `connect` pipeline
       */
      reduce(
        (acc, item) => {
          const middle =
            typeof item === "string"
              ? require(item)(resolvedPlugins)
              : item(resolvedPlugins)

          return is(middle) ? acc.use(middle) : acc
        },
        connect(),
        [
          "./middleware/req-bootstrap",
          "./middleware/req-cors",
          "./middleware/req-route-exists",
          // "./middleware/req-jwt",
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
      ),

      resolvedPlugins,
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
