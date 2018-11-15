const debug = require("debug")("Blocks:Main")

const connect = require("connect")
const path = require("path")
const pluginus = require("@asd14/pluginus")
const { pipe, map, forEach } = require("@asd14/m")

const createMiddlewarePipe = middleware => {
  const app = connect()

  for (let i = 0, length = middleware.length - 1; i <= length; i++) {
    app.use(middleware[i])
  }

  return app
}

module.exports = async ({
  settings = {},
  folders,
  plugins,
  routes,
  middleware: { beforeRoute = [], afterRoute = [] } = {},
}) =>
  Promise.all([
    // find and initialize plugins
    pluginus({
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
      handleName: fileName => fileName.replace(".route.js", ""),
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
      ...settings,
      STARTUP_TIME: new Date(),
    })

    return {
      middlewarePipeline: pipe(
        map(middleware => middleware(Plugins)),
        createMiddlewarePipe
      )([
        require("./middleware/req__1-bootstrap"),
        require("./middleware/req__2-cors"),
        require("./middleware/req__3-query"),
        require("./middleware/req__4-body"),
        require("./middleware/req__5-route-exists"),
        ...beforeRoute,
        require("./middleware/res__1-route"),
        ...afterRoute,
        require("./middleware/res__2-error"),
        require("./middleware/res__3-goodbye"),
      ]),

      Plugins,
    }
  })
