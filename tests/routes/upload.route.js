const debug = require("debug")("mutant:UploadRoute")

module.exports = {
  method: "POST",
  path: "/upload",

  /**
   * If req data is valid
   *  -> continue to permissionn check
   *  -> otherwise return 409
   */
  schema: require("./upload.schema"),

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
  action: () => ({ ctx: { body } }) => {
    return {
      file: body.file,
    }
  },
}
