const debug = require("debug")("Blocks:GoodPlugin")

export default {
  depend: [],

  create: () => {
    return {
      getMessage: () => `Hello Plugin World!`,
    }
  },
}
