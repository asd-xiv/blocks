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
      "Application loaded with 2 plugins initialized"
    )

    t.equals(
      Plugins.Router.count(),
      1,
      "Router plugin loaded /ping default route"
    )

    t.equals(
      count(middlewarePipeline.stack),
      7,
      "Middleware loaded (whithout cors)"
    )

    t.equals(
      Plugins.Config.get("APP_PORT"),
      3002,
      "Pass custom setting APP_PORT"
    )

    t.end()

    return null
  }))
