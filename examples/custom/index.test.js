import test from "tape"
import http from "http"
import path from "path"
import { promisify } from "util"
import { contains } from "@asd14/m"

import { block } from "../../src"

const request = require("request").defaults({
  json: true,
  headers: {
    "Content-Type": "application/json",
  },
})
const GET = promisify(request.get)

test("blocks - custom routes, middleware and plugins", t => {
  block({
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
    plugins: [path.resolve(__dirname, "plugins", "track.js")],
    routes: [require("./routes/metrics.route.js")],
    middleware: {
      beforeSend: [require("./middleware/res-track.js")],
    },
  }).then(({ Plugins, middlewarePipeline }) => {
    t.deepEquals(
      Object.keys(Plugins).sort(),
      ["Config", "Router", "Track"],
      "Custom Track plugin loaded"
    )

    t.equals(
      middlewarePipeline.stack.length,
      10,
      "Custom Track middleware loaded"
    )

    // Start server and test default route
    const server = http.createServer(middlewarePipeline)
    const port = Plugins.Config.get("PORT")

    server.listen(port, "localhost", async () => {
      // hit /ping so /metrics has data
      const pingRes = await GET(`http://localhost:${port}/ping`)

      t.equals(pingRes.body.ping, "pong", 'GET /ping responds with "pong"')

      const metricsRes = await GET(`http://localhost:${port}/metrics`)

      t.equals(
        contains(`method="GET",route="/ping",status="200"`)(metricsRes.body),
        true,
        "GET /metrics responds with Prometheus data"
      )

      server.close()
      t.end()
    })
  })
})
