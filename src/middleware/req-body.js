const debug = require("debug")("Blocks:BodyMiddleware")

import { isEmpty } from "@mutantlove/m"
import { InputValidationError } from "../errors/input"

const parseBody = req => {
  const bodyChunks = []

  return new Promise((resolve, reject) => {
    req
      .on("data", chunk => {
        bodyChunks.push(chunk)
      })
      .on("end", () => {
        try {
          const bodyString = Buffer.concat(bodyChunks).toString()

          resolve(isEmpty(bodyString) ? {} : JSON.parse(bodyString))
        } catch (error) {
          reject(new InputValidationError("Body is not valid JSON"))
        }
      })
  })
}

module.exports = () => (req, res, next) => {
  parseBody(req)
    .then(body => {
      req.ctx.body = body
      next()

      return null
    })
    .catch(next)
}
