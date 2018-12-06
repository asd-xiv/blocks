const debug = require("debug")("Blocks:Main")

const connect = require("connect")
const path = require("path")
const pluginus = require("@asd14/pluginus")
const { is, pipe, map, forEach } = require("@asd14/m")

const BaseError = require("./errors/base.error")
const NotFoundError = require("./errors/not-found.error")
const InputError = require("./errors/input.error")
const AuthorizationError = require("./errors/authorization.error")

const createMiddlewarePipe = middleware => {
  const app = connect()

  for (let i = 0, length = middleware.length - 1; i <= length; i++) {
    app.use(middleware[i])
  }

  return app
}

const block = ({
  settings = {},
  folders,
  plugins,
  routes,
  middleware: { beforeRoute = [], afterRoute = [], afterError = [] } = {},
}) =>
  Promise.all([
    // find and initialize plugins
    pluginus({
      seed: settings,
      folders,
      files: [
        path.resolve(__dirname, "plugins", "config.plugin.js"),
        path.resolve(__dirname, "plugins", "router.plugin.js"),
        plugins,
      ],
    }),

    // find and initialize routes
    pluginus({
      folders,
      files: [path.resolve(__dirname, "routes", "ping.route.js"), routes],
      name: fileName => fileName.replace(".route.js", ""),
    }),
  ]).then(([Plugins, Routes]) => {
    // add user defined routes to the Router plugin
    forEach(route => {
      Plugins.Router.add({
        ...route,
        isAllowed: route.isAllowed(Plugins),
        action: route.action(Plugins),
      })
    })(Object.values(Routes))

    //
    Plugins.Config.add({
      STARTUP_TIME: new Date(),
    })

    return {
      middlewarePipeline: pipe(
        map(middleware => middleware(Plugins)),
        createMiddlewarePipe
      )([
        require("./middleware/req-bootstrap"),
        ...(is(Plugins.Config.get("CORS_ORIGIN"))
          ? [require("./middleware/req-cors")]
          : []),
        require("./middleware/req-query"),
        require("./middleware/req-body"),
        require("./middleware/req-route-exists"),
        ...beforeRoute,
        require("./middleware/res-route"),
        ...afterRoute,
        require("./middleware/res-error"),
        ...afterError,
        require("./middleware/res-goodbye-error"),
        require("./middleware/res-goodbye"),
      ]),

      Plugins,
    }
  })

module.exports = {
  block,
  BaseError,
  AuthorizationError,
  InputError,
  NotFoundError,
}
