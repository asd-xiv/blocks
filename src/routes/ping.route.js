const debug = require("debug")("Blocks:PingRoute")

import { elapsedTime, is } from "@mutantlove/m"

module.exports = {
  method: "GET",
  path: "/ping",

  /**
   * If req data is valid
   *  -> continue to permissionn check
   *  -> otherwise return 409
   */
  schema: require("./ping.schema"),

  /**
   * Permission checking, if allowed:
   *  -> continue to action
   *  -> otherwise return 403**
   *
   * @param  {Object}  plugins  Plugins
   * @param  {Object}  req      Node request
   *
   * @return {boolean}
   */
  isAllowed: (/* plugins */) => async ({ method, ctx }) => {
    debug(`${method}:${ctx.pathname} - isAllowed`)

    return true
  },

  /**
   * After schema validation and permission checking, do route logic
   *
   * @param  {Object}  plugins  Plugins
   * @param  {Object}  req      Node request
   *
   * @return {mixed}
   */
  action: () => async () => ({
    name: is(process.env.APP_NAME) ? process.env.APP_NAME : "blocks",
    instance: is(process.env.pm_id) ? process.env.pm_id : "just me",
    version: process.env.APP_VERSION,
    ping: "pong",
    aliveFor: elapsedTime(process.env.STARTUP_TIME)(new Date()),
  }),
}
