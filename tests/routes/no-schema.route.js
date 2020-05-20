module.exports = {
  method: "GET",
  path: "/no-schema",

  // 409 if invalid req.query, req.headers, req.params or req.body
  // schema: require("./schema"),

  // 401 if returns false or throws
  authenticate: (/* plugins */) => (/* req */) => false,

  // 403 if returns false or throws
  authorize: (/* plugins */) => (/* req */) => true,

  /**
   * After schema validation and permission checking, do route logic
   *
   * @param  {Object}  plugins  Plugins
   * @param  {Object}  req      Node request
   *
   * @return {mixed}
   */

  action: (/* plugins */) => (/* req */) => ({
    message: "Default json schema works!",
  }),
}
