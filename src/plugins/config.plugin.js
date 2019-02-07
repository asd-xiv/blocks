/* eslint-disable no-sync */

const debug = require("debug")("Blocks:ConfigPlugin")
const { get, merge } = require("@asd14/m")

module.exports = {
  create: seed => () => {
    let settings = seed

    return {
      add: newSettings => {
        settings = merge(settings, newSettings)
      },
      get: key => get(key)(settings),
    }
  },
}
