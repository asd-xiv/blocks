import path from "node:path"
import connect from "connect"
import { pluginus } from "@asd14/pluginus"
import { pick, map, pipeP, is, forEach, reduce } from "@asd14/m"

import { importAll } from "./core.libs/node.js"
import { alwaysFalse } from "./core.libs/boolean.js"

const __dirname = new URL(".", import.meta.url).pathname

const block = async ({
  plugins: pluginPaths = [],
  routes: routesPaths = [],
  middleware: {
    beforeRoute = [],
    afterRoute = [],
    afterError = [],
    beforeSend = [],
  } = {},
} = {}) => {
  process.env.STARTUP_TIME = new Date()

  const plugins = await pluginus({
    source: [
      path.resolve(__dirname, "plugin.router", "router.js"),
      path.resolve(__dirname, "plugin.query-parser", "query-parser.js"),
      ...pluginPaths,
    ],
  })

  const middlewarePipeline = await pipeP(
    map(item =>
      typeof item === "string" ? path.resolve(__dirname, item) : item
    ),
    importAll,
    pick("default"),
    reduce((accumulator, item) => {
      const middlewareFn = item(plugins)

      return is(middlewareFn) ? accumulator.use(item(plugins)) : accumulator
    }, connect())
  )([
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
  ])

  const routes = await pipeP(
    map(item =>
      typeof item === "string" ? path.resolve(__dirname, item) : item
    ),
    importAll,
    pick("default"),
    map(({ authenticate, authorize, action, ...rest }) => {
      return {
        ...rest,
        authenticate:
          typeof authenticate === "function"
            ? authenticate(plugins)
            : alwaysFalse,
        authorize:
          typeof authorize === "function" ? authorize(plugins) : alwaysFalse,
        action: action(plugins),
      }
    })
  )(["./route.ping/ping.js", ...routesPaths])

  forEach(item => {
    plugins.Router.add(item)
  }, routes)

  return [middlewarePipeline, plugins]
}

export { block }
export { BaseError } from "./core.errors/base.js"
export { InputError } from "./core.errors/input.js"
export { NotFoundError } from "./core.errors/not-found.js"
export { AuthorizationError } from "./core.errors/authorization.js"
export { AuthenticationError } from "./core.errors/authentication.js"
