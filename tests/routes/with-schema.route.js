module.exports = {
  method: "GET",
  path: "/with-schema/:name",

  /**
   * If req data is valid
   *  -> continue to permissionn check
   *  -> otherwise return 409
   */
  schema: require("./with-schema.schema"),

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
  action: ({ Good }) => async ({ ctx }) => {
    return {
      message: Good.getMessage(),
      params: ctx.params,
      query: ctx.query,
    }
  },
}
