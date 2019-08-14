const debug = require("debug")("Blocks:GoodPlugin")

export default {
  depend: ["Config"],

  create: () => Config => {
    return {
      getMessage: () => `Hello ${Config.NAME} Plugin World!`,
    }
  },
}
