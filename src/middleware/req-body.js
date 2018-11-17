const debug = require("debug")("Blocks:BodyMiddleware")
const { isEmpty } = require("@asd14/m")

const InputValidationError = require("../errors/input.error")

/**
 * { function_description }
 *
 * @param  {Object}   req  The request
 *
 * @return {Promise}
 */
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
