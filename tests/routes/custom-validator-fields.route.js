/**
 * @typedef { import("../users.model").UsersPlugin} UsersPlugin
 */

/**
 *
 *
 * @api        {DELETE} /custom-validator
 * @permission {NONE}
 *
 * @throws {NotFoundError}
 *
 * @returns {Promise<object>}
 *
 * @example
 */
const exports = {
  method: "PATCH",
  path: "/custom-validator/:id",

  /**
   * Check "req.query", "req.header", "req.params" and "req.body"
   * against a JSON Schema. If check fails, respond with 409,
   * otherwise continue to ".authenticate".
   */
  schema: "./custom-validator-fields.schema",

  /**
   * Check for valid JWT.
   *
   * @param {object} plugins Application plugins
   *
   * @returns {function(object): boolean | Promise<boolean>}
   * If false, responds with 401, otherwise continue to ".authorize".
   */
  authenticate: () => () => true,

  /**
   * Check if is allowed to access underlying resource.
   *
   * @param {object}            plugins             Application plugins
   * @param {PermissionsPlugin} plugins.Permissions Permissions model
   * @param {UsersPlugin}       plugins.Users       Users model
   *
   * @returns {function(object): (boolean | Promise<boolean>)}
   * If false, respond with 403, otherwise continue to ".action".
   */
  authorize: () => () => true,

  /**
   * Route/Controller logic
   *
   * @param {object} plugins Application plugins
   *
   * @returns {(Object) => Promise<*>} 500 if throws, 201 if POST, 200 otherwise
   */
  action:
    (/* plugins */) =>
    ({ ctx: { query, params, body } }) => {
      return {
        query,
        params,
        body,
      }
    },
}

export default exports
