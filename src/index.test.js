const test = require("tape")
const path = require("path")
const { count } = require("@asd14/m")

const { block } = require(".")

test("blocks", t =>
  block({
    settings: {
      APP_VERSION: 1,
      APP_PORT: 3002,
    },
    folders: path.resolve("./src"),
  }).then(({ Plugins, middlewarePipeline }) => {
    t.deepEquals(
      Object.keys(Plugins),
      ["Router", "Config"],
      "Router and Config plugins initialized"
    )

    t.equals(Plugins.Router.count(), 1, "Router plugin has /ping route")

    t.equals(
      count(middlewarePipeline.stack),
      7,
      "7 middleware loaded (whithout cors)"
    )

    t.equals(
      Plugins.Config.get("APP_PORT"),
      3002,
      "Custom setting APP_PORT overwrites default"
    )

    t.end()

    return null
  }))
