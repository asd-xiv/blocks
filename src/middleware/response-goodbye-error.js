const debug = require("debug")("blocks:GoodbyeErrorMiddleware")

module.exports = () => (error, request, response, next) => {
  /*
   * supporting multiple error middleware needs a last one that does e
   * non-error callback so the final goodbye middleware gets also run
   */
  next()
}
