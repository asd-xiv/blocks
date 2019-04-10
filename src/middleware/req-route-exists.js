const debug = require("debug")("Blocks:URLParamsMiddleware")

import { NotFoundError } from "../errors/not-found"

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
