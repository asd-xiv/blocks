const debug = require("debug")("Blocks:URLParamsMiddleware")
const NotFoundError = require("../errors/not-found.error")

module.exports = ({ Router }) => (req, res, next) => {
  const { route, params } = Router.find({
    method: req.method,
    pathname: req.ctx.pathname,
  })

  if (route) {
    req.ctx.params = params
    req.ctx.route = route

    next()
  } else {
    next(
      new NotFoundError("Endpoint not found", {
        method: req.method,
        pathname: req.ctx.pathname,
      })
    )
  }
}
