const { elapsedTime, is } = require("@mutant-ws/m")

module.exports = {
  method: "GET",
  path: "/ping",

  // 409 if invalid req.query, req.headers, req.params or req.body
  schema: require("./ping.schema"),

  // 401 if returns false or throws
  authenticate: (/* plugins */) => (/* req */) => true,

  // 403 if returns false or throws
  authorize: (/* plugins */) => (/* req */) => true,

  action: (/* plugins */) => (/* req */) => ({
    name: is(process.env.APP_NAME) ? process.env.APP_NAME : "blocks",
    instance: is(process.env.pm_id) ? process.env.pm_id : "just me",
    version: process.env.APP_VERSION,
    ping: "pong",
    aliveFor: elapsedTime(process.env.STARTUP_TIME)(new Date()),
  }),
}
