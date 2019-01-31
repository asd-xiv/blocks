const debug = require("debug")("Blocks:MetricsMiddleware")

module.exports = ({ Prometheus }) => (req, res, next) => {
  const endAt = process.hrtime(req.ctx.startAt)

  Prometheus.measure({
    method: req.method,
    route: req.ctx.pathname,
    status: res.ctx.status,
    duration: endAt[0] * 1000 + endAt[1] / 1000000,
  })

  next()
}
