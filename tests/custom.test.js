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

describe("blocks :: init with .env data", async assert => {
  // load env vars
  require("dotenv").config({ path: "./tests/.test-env" })

  // init after process.env is populated with custom values
  const { Plugins, middlewarePipeline } = await block({
    plugins: [path.resolve(__dirname, "plugins", "good.js")],
    routes: [
      require("./routes/no-schema.route"),
      require("./routes/with-schema.route"),
      require("./routes/no-allow.route"),
    ],
  })

  assert({
    given: ".env file loaded",
    should: "have custom settings",
    actual: Plugins.Config,
    expected: {
      STARTUP_TIME: Plugins.Config.STARTUP_TIME,
      NAME: "blocks-test",
      PORT: 8080,
      CORS_ORIGIN: ["http://localhost"],
      CORS_METHODS: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
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
    given: "route without isAllowed",
    should: "return 403",
    actual: await request(`${API_URL}/no-allow`).catch(res => ({
      status: res.statusCode,
      body: res.error,
    })),
    expected: {
      status: 403,
      body: {
        error: "AuthorizationError",
        code: 403,
        message: "Not allowed to access resource",
        details: {},
      },
    },
  })

  assert({
    given: "route with schema and custom plugin",
    should: "return 200 with plugin message",
    actual: await request(`${API_URL}/with-schema/ParamTest`),
    expected: {
      message: "Hello blocks-test Plugin World!",
      params: { name: "ParamTest" },
      query: {},
    },
  })

  assert({
    given: "route with schema and sending wrong data",
    should: "return 409 with field error details",
    actual: await request(`${API_URL}/with-schema/test?limit=10`).catch(
      res => ({ status: res.statusCode, body: res.error })
    ),
    expected: {
      status: 409,
      body: {
        error: "InputValidationError",
        code: 409,
        message: "Invalid request data",
        details: {
          fieldErrors: [
            {
              keyword: "additionalProperties",
              dataPath: ".query",
              schemaPath: "#/properties/query/additionalProperties",
              params: { additionalProperty: "limit" },
              message: "should NOT have additional properties",
            },
          ],
        },
      },
    },
  })

  server.close()
})
