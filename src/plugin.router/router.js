import Ajv from "ajv"
import addFormats from "ajv-formats"
import { pathToRegexp } from "path-to-regexp"
import { count, reduce, findWith, merge, pluck, is, isEmpty } from "@asd14/m"

import { InputError } from "../core.errors/input.js"
import { AuthenticationError } from "../core.errors/authentication.js"
import { AuthorizationError } from "../core.errors/authorization.js"
import { NotFoundError } from "../core.errors/not-found.js"

export default {
  create: async () => {
    const ALL_ERRORS = process.env.AJV_ALL_ERRORS
    const COERCE_TYPES = process.env.AJV_COERCE_TYPES
    const USE_DEFAULTS = process.env.AJV_USE_DEFAULTS

    const ajv = new Ajv({
      allErrors: is(ALL_ERRORS) ? ALL_ERRORS === "true" : true,
      coerceTypes: is(COERCE_TYPES) ? COERCE_TYPES === "true" : true,
      useDefaults: is(USE_DEFAULTS) ? USE_DEFAULTS === "true" : true,
    })

    addFormats(ajv, {
      formats: [
        "date",
        "time",
        "date-time",
        "duration",
        "email",
        "uuid",
        "uri",
        "ipv4",
        "ipv6",
        "regex",
      ],
    })

    const { default: defaultRouteSchema } = await import("./default.schema.js")
    const routes = []

    return {
      count: () => count(routes),

      /**
       * Searches for the first match.
       *
       * @param {object} arg1          Props
       * @param {string} arg1.method   HTTP method
       * @param {string} arg1.pathname URL pathname
       *
       * @returns {object}
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

        const parametersList = route.pathRegExp.exec(pathname)
        const parameters = reduce(
          (accumulator, item, index) => ({
            ...accumulator,
            [item.name]: parametersList[index + 1],
          }),
          {},
          route.pathParamsKeys
        )

        return {
          route,
          params: parameters,
        }
      },

      /**
       * @param {object}   props
       * @param {string}   props.method
       * @param {string}   props.path
       * @param {object}   props.schema
       * @param {Function} props.authenticate
       * @param {Function} props.authorize
       *
       * @returns {undefined}
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
              pluck(["headers", "params", "query", "body"])(schema)
            ),
          }),
        })
      },

      /**
       * { function_description }
       *
       * @param {object} arg1       The argument 1
       * @param {object} arg1.route The route
       * @param {object} arg1.req   The request
       *
       * @returns {object}
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
                  throw new AuthenticationError(error.message, error.details)
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
                  throw new AuthorizationError(error.message, error.details)
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
