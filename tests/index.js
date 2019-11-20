import http from "http"
import path from "path"
import { describe } from "riteway"

import { block } from "../src"

const request = require("request-promise").defaults({
  json: true,
  headers: {
    "Content-Type": "application/json",
  },
})

describe("blocks :: init with defaults", async assert => {
  const { Plugins, middlewarePipeline } = await block({
    plugins: [path.resolve(__dirname, "plugins", "good.js")],
    routes: [
      require("./routes/no-schema.route"),
      require("./routes/with-schema.route"),
      require("./routes/no-allow.route"),
      require("./routes/return-undefined.route"),
    ],
  })

  assert({
    given: "1 custom plugin",
    should: "load default plugins (Router, QueryParser) and custom",
    actual: Object.keys(Plugins),
    expected: ["Router", "QueryParser", "Good"],
  })

  assert({
    given: "4 custom routes",
    should: "load default /ping and custom",
    actual: Plugins.Router.count(),
    expected: 5,
  })

  assert({
    given: "no custom middleware",
    should: "contain 9 middleware",
    actual: middlewarePipeline.stack.length,
    expected: 9,
  })

  const PORT = 4567
  const API_URL = `http://localhost:${PORT}`
  const server = http.createServer(middlewarePipeline).listen(PORT, "localhost")

  assert({
    given: "default route /ping",
    should: "response with pong",
    actual: await request(`${API_URL}/ping`, {
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    }).then(body => ({
      name: body.name,
      ping: body.ping,
    })),
    expected: { name: "blocks", ping: "pong" },
  })

  assert({
    given: "route path does not exist",
    should: "return 404",
    actual: await request(`${API_URL}/not-exist`).catch(res => ({
      status: res.statusCode,
      body: res.error,
    })),
    expected: {
      status: 404,
      body: {
        error: "NotFoundError",
        code: 404,
        message: "Endpoint GET:/not-exist not found",
        details: {
          method: "GET",
          pathname: "/not-exist",
        },
      },
    },
  })

  assert({
    given: "route that returns undefined",
    should: "return empty JSON object",
    actual: await request(`${API_URL}/return-undefined`),
    expected: {},
  })

  assert({
    given: "form encoded body and content type",
    should: "parse body with qs",
    actual: await request(`${API_URL}/with-schema/mutant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "parsed=with%20qs&another=value",
    }),
    expected: {
      message: "Hello Plugin World!",
      params: { name: "mutant" },
      query: {},
      body: { parsed: "with qs", another: "value" },
    },
  })

  server.close()
})
