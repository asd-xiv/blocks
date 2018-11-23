const debug = require("debug")("Blocks:Example")

const http = require("http")
const path = require("path")
const { block } = require("../../src")

module.exports = block({
  settings: {
    VERSION: 1,
    PORT: 3002,
  },
  folders: path.resolve("./src"),
}).then(({ Plugins: { Config }, middlewarePipeline }) =>
  http
    .createServer(middlewarePipeline)
    .on("close", () => {})
    .on("error", error => debug(error))
    .listen(Config.get("PORT"), "localhost", () => {
      debug(`### Started server on port ${Config.get("PORT")}`)
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
