const debug = require("debug")("Blocks:RouterPlugin")

import pathToRegexp from "path-to-regexp"
import { count, push, reduce, find, merge, pick } from "@mutantlove/m"

import { InputValidationError } from "../errors/input"
import { AuthorizationError } from "../errors/authorization"

export default {
  depend: ["Config"],

  create: () => ({ AJV_ALL_ERRORS, AJV_COERCE_TYPES, AJV_USE_DEFAULTS }) => {
    const ajv = require("ajv")({
      allErrors: AJV_ALL_ERRORS,
      coerceTypes: AJV_COERCE_TYPES,
      useDefaults: AJV_USE_DEFAULTS,
    })
    const defaultRouteSchema = require("./route-default.schema")

    let routes = []

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
      add: ({ method = "GET", path, schema = {}, isAllowed, ...rest }) => {
        const keys = []

        debug(`Add route: ${method}:${path}`)

        routes = push({
          method,
          path,
          schema,
          isAllowed,
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
          throw new InputValidationError("Invalid request data", {
            fieldErrors: route.validate.errors,
          })
        }

        return (
          Promise.resolve(route.isAllowed(req))
            .then(isAllowed => {
              if (!isAllowed) {
                throw new AuthorizationError()
              }

              return null
            })
            // Route action logic
            .then(() => route.action(req))
            .then(routePayloaad => ({
              status: req.method === "POST" ? 201 : 200,
              payload: routePayloaad,
            }))
        )
      },
    }
  },
}
