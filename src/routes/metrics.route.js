const debug = require("debug")("Blocks:MetricsRoute")

module.exports = {
  method: "GET",
  path: "/metrics",
  schema: require("./metrics.schema"),

  /**
   * Permission checking. If allowed will continue to action, otherwise return
   * 403.
   *
   * @param  {Object}  plugins  All plugins
   * @param  {Object}  req      The request
   *
   * @return {boolean}
   */
  isAllowed: () => async ({ method, ctx }) => {
    debug(`${method}: ${ctx.pathname} - isAllowed`)

    return true
  },

  /**
   * Create a new event or update existing event's steps & extend tags
   *
   * @param  {Object}  plugins  All plugins
   * @param  {Object}  req      The request
   *
   * @return {Object}
   */
  action: ({ Prometheus }) => async () => Prometheus.getMetrics(),
}
