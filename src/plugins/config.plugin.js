/* eslint-disable no-sync */

const debug = require("debug")("Blocks:ConfigPlugin")
const { get, merge } = require("@asd14/m")
const pkg = require("../../package.json")

module.exports = {
  depend: [],

  create: () => {
    let settings = {
      MICRO_VERSION: pkg.version,
      ENV: process.env.NODE_ENV,
      CORS_ORIGIN: null,
      CORS_METHODS: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    }

    return {
      add: newSettings => {
        settings = merge(settings, newSettings)
      },
      get: key => get(key)(settings),
    }
  },
}
