const debug = require("debug")("Blocks:CustomRoute")

module.exports = {
  method: "GET",
  path: "/no-allow",

  /**
   * After schema validation and permission checking, do route logic
   *
   * @param  {Object}  plugins  Plugins
   * @param  {Object}  req      Node request
   *
   * @return {mixed}
   */
  action: () => () => ({
    ping: "pong",
  }),
}
