const debug = require("debug")("Blocks:Example")

const http = require("http")
const path = require("path")
const { block } = require("../../src")

module.exports = block({
  settings: {
    VERSION: 1,
    PORT: 3002,
    CORS_ORIGIN: [
      "http://leeruniek.localhost:3000",
      "https://stage.leeruniek.nl",
      "https://portal.leeruniek.nl",
    ],
    CORS_METHODS: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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
