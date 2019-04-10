import test from "tape"
import http from "http"

import { block } from "../../src"

const request = require("request").defaults({
  json: true,
  headers: {
    "Content-Type": "application/json",
  },
})

test("blocks - defaults", t => {
  block().then(({ Plugins, middlewarePipeline }) => {
    t.deepEquals(
      Object.keys(Plugins),
      ["Router", "Config"],
      "Application loaded with Router and Config plugins initialized"
    )

    t.equals(
      Plugins.Router.count(),
      1,
      "Router plugin loaded /ping default route"
    )

    t.equals(
      middlewarePipeline.stack.length,
      8,
      "Middleware loaded (without CORS)"
    )

    t.equals(Plugins.Config.get("PORT"), 8080, "Default port should be 8080")

    // Start server and test default route
    const server = http.createServer(middlewarePipeline)

    server.listen(Plugins.Config.get("PORT"), "localhost", () => {
      // test if /ping responds
      request(
        `http://localhost:${Plugins.Config.get("PORT")}/ping`,
        (error, response, body) => {
          t.equals(body.ping, "pong", 'GET /ping responds with "pong"')

          server.close()

          t.end()
        }
      )
    })
  })
})
