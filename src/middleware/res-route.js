const debug = require("debug")("blocks:RouteMiddleware")

module.exports = ({ Router }) => (req, res, next) => {
  Router.answer({
    req,
    route: req.ctx.route,
  })
    .then(answer => {
      res.ctx.status = answer.status
      res.ctx.payload = answer.payload

      return next()
    })
    .catch(next)
}
