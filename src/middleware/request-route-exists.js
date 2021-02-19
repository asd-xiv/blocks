const debug = require("debug")("blocks:RouteExistsMiddleware")

module.exports = ({ Router }) => (request, response, next) => {
  try {
    const { route, params } = Router.find({
      method: request.method,
      pathname: request.ctx.pathname,
    })

    request.ctx.params = params
    request.ctx.route = route

    next()
  } catch (error) {
    // NotFoundError
    next(error)
  }
}
