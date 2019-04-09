/* eslint-disable no-sync */

const debug = require("debug")("Blocks:ConfigPlugin")

import { get, merge } from "@asd14/m"

export default {
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
