const debug = require("debug")("Blocks:PingRoute")
const { elapsedTime } = require("@asd14/m")
/**
 * GET: /ping
 */

module.exports = {
  method: "GET",
  path: "/ping",
  schema: require("./ping.schema"),

  /**
   * Permission checking.
   * If allowed will continue to action, otherwise return 403.
   *
   * @param  {Object}  plugins  All plugins
   * @param  {Object}  req      The request
   *
   * @return {boolean}
   */
  isAllowed: (/* plugins */) => async ({ method, ctx }) => {
    debug(`${method}:${ctx.pathname} - isAllowed`)

    return true
  },

  /**
   * Route logic.
   * Do something here that will confirm you not being a pencil pusher.
   *
   * @param  {Object}  plugins  All plugins
   * @param  {Object}  req      The request
   *
   * @return {mixed}
   */
  action: plugins => async () => ({
    ping: "pong",
    aliveFor: elapsedTime(plugins.Config.get("STARTUP_TIME"))(new Date()),
    v: plugins.Config.get("MICRO_VERSION"),
    v2: plugins.Config.get("APP_VERSION") || "",
  }),
}
