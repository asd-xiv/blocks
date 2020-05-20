const debug = require("debug")("blocks:RouteExistsMiddleware")

module.exports = ({ Router }) => (req, res, next) => {
  try {
    const { route, params } = Router.find({
      method: req.method,
      pathname: req.ctx.pathname,
    })

    req.ctx.params = params
    req.ctx.route = route

    next()
  } catch (error) {
    // NotFoundError
    next(error)
  }
}
