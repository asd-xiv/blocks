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
    ],
  })

  assert({
    given: "1 custom plugin",
    should: "load default plugins and custom",
    actual: Object.keys(Plugins),
    expected: ["Config", "Good", "Router"],
  })

  assert({
    given: "3 custom routes",
    should: "load default /ping and custom",
    actual: Plugins.Router.count(),
    expected: 4,
  })

  assert({
    given: "no custom middleware",
    should: "contain 9 middleware",
    actual: middlewarePipeline.stack.length,
    expected: 9,
  })

  assert({
    given: "no .env data provided",
    should: "have default settings",
    actual: Plugins.Config,
    expected: {
      STARTUP_TIME: Plugins.Config.STARTUP_TIME,
      NAME: "blocks",
      PORT: 8000,
      JWT_SECRET: undefined,
      CORS_ORIGIN: undefined,
      CORS_METHODS: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      QS_DELIMITER: "&",
      QS_ALLOW_DOTS: true,
      QS_STRICT_NULL_HANDLING: true,
      QS_ARRAY_FORMAT: "brackets",
      HELMET_CONTENT_SECURITY_POLICY: false,
      HELMET_DNS_PREFETCH_CONTROL: true,
      HELMET_EXPECT_CT: false,
      HELMET_FEATURE_POLICY: false,
      HELMET_FRAMEGUARD: true,
      HELMET_HIDE_POWER_BY: false,
      HELMET_HSTS: true,
      HELMET_IE_NO_OPEN: true,
      HELMET_NO_CACHE: true,
      HELMET_NO_SNIFF: true,
      HELMET_CROSSDOMAIN: true,
      HELMET_REFERER_POLICY: false,
      HELMET_XSS_FILTER: true,
      AJV_ALL_ERRORS: true,
      AJV_COERCE_TYPES: true,
      AJV_USE_DEFAULTS: true,
    },
  })

  const API_URL = `http://localhost:${Plugins.Config.PORT}`
  const server = http
    .createServer(middlewarePipeline)
    .listen(Plugins.Config.PORT, "localhost")

  assert({
    given: "default route /ping",
    should: "response with pong",
    actual: await request(`${API_URL}/ping`).then(body => ({
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
        message: "Endpoint not found",
        details: {
          method: "GET",
          pathname: "/not-exist",
        },
      },
    },
  })

  server.close()
})
