const debug = require("debug")("Blocks:BodyMiddleware")

import {
  find,
  get,
  pipe,
  when,
  startsWith,
  i,
  is,
  isEmpty,
} from "@mutantlove/m"
import { InputValidationError } from "../errors/input"

const apply = args => fn => fn.apply(null, args)

const parseBody = (req, parseFnByContentType) => {
  const bodyChunks = []

  return new Promise((resolve, reject) => {
    req
      .on("data", chunk => {
        bodyChunks.push(chunk)
      })
      .on("end", () => {
        try {
          const bodyString = Buffer.concat(bodyChunks).toString()

          resolve(
            pipe(
              find(([match]) =>
                pipe(get(["headers", "content-type"]), startsWith(match))(req)
              ),
              when(
                is,
                ([, parseFn]) => parseFn,
                () => i
              ),
              apply([bodyString])
            )(parseFnByContentType)
          )
        } catch (error) {
          reject(new InputValidationError("Body is not valid JSON"))
        }
      })
  })
}

module.exports = ({ QueryParser }) => (req, res, next) => {
  parseBody(req, [
    ["application/json", source => (isEmpty(source) ? {} : JSON.parse(source))],
    ["application/x-www-form-urlencoded", QueryParser.parse],
  ])
    .then(body => {
      req.ctx.body = body
      next()
    })
    .catch(next)
}
