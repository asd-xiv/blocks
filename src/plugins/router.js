/* eslint-disable promise/no-nesting */

const debug = require("debug")("blocks:RouterPlugin")

const { pathToRegexp } = require("path-to-regexp")
const {
  count,
  reduce,
  findWith,
  merge,
  pick,
  is,
  isEmpty,
} = require("@asd14/m")

const { InputError } = require("../errors/input")
const { AuthenticationError } = require("../errors/authentication")
const { AuthorizationError } = require("../errors/authorization")
const { NotFoundError } = require("../errors/not-found")

module.exports = {
  create: () => {
    const ALL_ERRORS = process.env.AJV_ALL_ERRORS
    const COERCE_TYPES = process.env.AJV_COERCE_TYPES
    const USE_DEFAULTS = process.env.AJV_USE_DEFAULTS

    const ajv = require("ajv")({
      allErrors: is(ALL_ERRORS) ? ALL_ERRORS === "true" : true,
      coerceTypes: is(COERCE_TYPES) ? COERCE_TYPES === "true" : true,
      useDefaults: is(USE_DEFAULTS) ? USE_DEFAULTS === "true" : true,
    })
    const defaultRouteSchema = require("./route-default.schema")
    const routes = []

    return {
      count: () => count(routes),

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
        const route = findWith(
          {
            method,
            pathRegExp: field => field.test(pathname),
          },
          {},
          routes
        )

        if (isEmpty(route)) {
          throw new NotFoundError(`Endpoint ${method}:${pathname} not found`)
        }

        const paramsList = route.pathRegExp.exec(pathname)
        const params = reduce(
          (acc, element, index) => ({
            ...acc,
            [element.name]: paramsList[index + 1],
          }),
          {},
          route.pathParamsKeys
        )

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
      add: ({
        method = "GET",
        path,
        schema = {},
        authenticate,
        authorize,
        ...rest
      }) => {
        const keys = []

        debug(`Loading ${method}: ${path}`)

        routes.push({
          method,
          path,
          schema,
          authenticate,
          authorize,
          ...rest,
          pathParamsKeys: keys,
          pathRegExp: pathToRegexp(path, keys),
          validate: ajv.compile({
            type: "object",
            properties: merge(
              defaultRouteSchema,
              pick(["headers", "params", "query", "body"])(schema)
            ),
          }),
        })
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
      answer: ({ route, req }) => {
        // Input validation check
        if (
          !route.validate({
            headers: req.headers,
            params: req.ctx.params,
            query: req.ctx.query,
            body: req.ctx.body,
          })
        ) {
          throw new InputError("Invalid request data", {
            fieldErrors: route.validate.errors,
          })
        }

        return (
          Promise.resolve()
            // Authentication
            .then(() =>
              Promise.resolve()
                .then(() => route.authenticate(req))
                .catch(error => {
                  throw new AuthenticationError({
                    message: error.message,
                    details: error.details,
                  })
                })
            )
            .then(isAuthenticated => {
              if (isAuthenticated === false) {
                throw new AuthenticationError()
              }
            })
            // Authorization
            .then(() =>
              Promise.resolve()
                .then(() => route.authorize(req))
                .catch(error => {
                  throw new AuthorizationError({
                    message: error.message,
                    details: error.details,
                  })
                })
            )
            .then(isAuthorized => {
              if (isAuthorized === false) {
                throw new AuthorizationError()
              }
            })
            // Route business logic
            .then(() => route.action(req))
            .then(payload => ({
              status: req.method === "POST" ? 201 : 200,
              payload,
            }))
        )
      },
    }
  },
}
