const debug = require("debug")("blocks:Main")

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

  return pluginus({ source: PLUGIN_PATHS }).then(Plugins => {
    forEach(item => {
      const { authenticate, authorize, action, ...rest } =
        typeof item === "string" ? require(item) : item

      Plugins.Router.add({
        ...rest,
        authenticate: is(authenticate) ? authenticate(Plugins) : () => false,
        authorize: is(authorize) ? authorize(Plugins) : () => false,
        action: action(Plugins),
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

module.exports = {
  block,
  BaseError,
  InputError,
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
}
