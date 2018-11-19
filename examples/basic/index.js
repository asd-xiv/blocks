const debug = require("debug")("Blocks:Example")

const http = require("http")
const path = require("path")
const { block } = require("../../src")

module.exports = block({
  // settings: {},
  folders: path.resolve("./src"),
}).then(({ Plugins: { Config }, middlewarePipeline }) =>
  http
    .createServer(middlewarePipeline)
    .on("close", () => {})
    .on("error", error => debug(error))
    .listen(Config.get("APP_PORT"), "localhost", () => {
      debug(`### Started server on port ${Config.get("APP_PORT")}`)
    })
)

/*
 * Catch the uncaught errors that weren't wrapped in a domain or try catch
 * statement. do not use this in modules, but only in applications, as
 * otherwise we could have multiple of these bound
 */
process.on("uncaughtException", strangeError => {
  debug("NOO", {
    strangeError,
  })
})
