module.exports = {
  method: "GET",
  path: "/no-schema",

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
  isAllowed: (/* plugins */) => async () => true,

  /**
   * After schema validation and permission checking, do route logic
   *
   * @param  {Object}  plugins  Plugins
   * @param  {Object}  req      Node request
   *
   * @return {mixed}
   */
  action: () => async () => {
    return {
      message: "Default json schema works!",
    }
  },
}
