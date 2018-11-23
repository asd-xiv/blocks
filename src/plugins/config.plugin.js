/* eslint-disable no-sync */

const debug = require("debug")("Blocks:ConfigPlugin")
const { get, merge } = require("@asd14/m")
const pkg = require("../../package.json")

module.exports = {
  create: seed => () => {
    let settings = {
      PORT: 8080,
      MICRO_VERSION: pkg.version,
      ENV: "development",
      CORS_ORIGIN: null,
      CORS_METHODS: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      ...seed,
    }

    return {
      add: newSettings => {
        settings = merge(settings, newSettings)
      },
      get: key => get(key)(settings),
    }
  },
}
