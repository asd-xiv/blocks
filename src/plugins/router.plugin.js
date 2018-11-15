const debug = require("debug")("Blocks:RouterPlugin")

const pathToRegexp = require("path-to-regexp")
const { push, reduce, find } = require("@asd14/m")
const ajv = require("ajv")({
  allErrors: true,
  coerceTypes: true,
  useDefaults: true,
})

const InputValidationError = require("../errors/input-validation.error")
const AuthorizationError = require("../errors/authorization.error")

module.exports = {
  depend: [],

  create: () => {
    let routes = []

    return {
      /**
       * Searches for the first match.
       *
       * @param  {Object}  arg1           Props
       * @param  {string}  arg1.method    HTTP method
       * @param  {string}  arg1.pathname  URL pathname
       *
       * @return {Object}
       */
      find: ({ method, pathname }) => {
        const route = find(element => {
          const isPathMatch = element.pathRegExp.test(pathname)
          const isMethodMatch = method === element.method

          return isPathMatch && isMethodMatch
        })(routes)

        let params = {}

        if (route) {
          const paramsList = route.pathRegExp.exec(pathname)

          params = reduce(
            (acc, element, index) => ({
              ...acc,
              [element.name]: paramsList[index + 1],
            }),
            {}
          )(route.pathParamsKeys)
        }

        return {
          route,
          params,
        }
      },

      /**
       * { function_description }
       *
       * @param  {Object}  newRoute  Route
       *
       * @return {undefined}
       */
      add: newRoute => {
        const keys = []

        routes = push({
          ...newRoute,
          pathParamsKeys: keys,
          pathRegExp: pathToRegexp(newRoute.path, keys),
          validate: ajv.compile(newRoute.schema),
        })(routes)
      },

      /**
       * { function_description }
       *
       * @param  {Object}  arg1        The argument 1
       * @param  {Object}  arg1.route  The route
       * @param  {Object}  arg1.req    The request
       *
       * @return {Object}
       */
      answer: async ({ route, req }) => {
        // json schema check
        if (
          !route.validate({
            headers: req.headers,
            params: req.ctx.params,
            query: req.ctx.query,
            body: req.ctx.body,
          })
        ) {
          throw new InputValidationError("Invalid request data", {
            fieldErrors: route.validate.errors,
          })
        }

        // permission check
        if (!(await route.isAllowed(req))) {
          throw new AuthorizationError()
        }

        return {
          status: req.method === "POST" ? 201 : 200,
          payload: await route.action(req),
        }
      },
    }
  },
}
