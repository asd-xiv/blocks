const debug = require("debug")("mutant:WithJWTRoute")

module.exports = {
  method: "GET",
  path: "/with-jwt",

  /**
   * Permission checking, if allowed:
   *  -> continue to action
   *  -> otherwise return 403
   *
   * @param  {Object}  plugins  Plugins
   * @param  {Object}  req      Node request
   *
   * @return {boolean}
   */
  isAllowed: () => () => true,

  /**
   * After schema validation and permission checking, do route logic
   *
   * @param  {Object}  plugins  Plugins
   * @param  {Object}  req      Node request
   *
   * @return {mixed}
   */
  action: () => ({
    ctx: {
      jwt: { jti, foo },
    },
  }) => {
    return {
      jti,
      foo,
    }
  },
}
