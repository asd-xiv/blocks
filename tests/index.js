/* eslint-disable new-cap,no-sync */

import http from "http"
import path from "path"
import jwt from "jsonwebtoken"
import { describe } from "riteway"
import { createReadStream, existsSync } from "fs"

import { GET, POST, FORM_DATA } from "./http.lib"
import { block } from "../src"

describe("blocks :: init with defaults", async assert => {
  {
    const [middleware, plugins] = await block({
      plugins: [path.resolve(__dirname, "plugins", "good.js")],
      routes: [
        require("./routes/no-schema.route"),
        require("./routes/with-schema.route"),
        require("./routes/no-allow.route"),
        require("./routes/dont-allow.route"),
        require("./routes/return-undefined.route"),
        require("./routes/upload.route"),
      ],
    })

    assert({
      given: "1 custom plugin",
      should: "load default plugins (Router, QueryParser) and custom",
      actual: Object.keys(plugins).sort(),
      expected: ["Good", "QueryParser", "Router"],
    })

    assert({
      given: "6 custom routes",
      should: "load default /ping and all custom",
      actual: plugins.Router.count(),
      expected: 7,
    })

    assert({
      given: "no custom middleware",
      should: "contain 9 middleware",
      actual: middleware.stack.length,
      expected: 9,
    })

    const PORT = 4567
    const API_URL = `http://localhost:${PORT}`
    const server = http.createServer(middleware).listen(PORT, "localhost")

    assert({
      given: "default route /ping",
      should: "response with pong",
      actual: await GET(`${API_URL}/ping`).then(({ name, ping }) => ({
        name,
        ping,
      })),
      expected: { name: "blocks", ping: "pong" },
    })

    assert({
      given: "route path does not exist",
      should: "return 404",
      actual: await GET(`${API_URL}/not-exist`).catch(({ status, body }) => ({
        status,
        body,
      })),
      expected: {
        status: 404,
        body: {
          error: "NotFoundError",
          code: 404,
          message: "Endpoint GET:/not-exist not found",
          details: {
            method: "GET",
            path: "/not-exist",
          },
        },
      },
    })

    assert({
      given: "route without isAllowed defined",
      should: "return 403",
      actual: await GET(`${API_URL}/no-allow`).catch(({ status, body }) => ({
        status,
        body,
      })),
      expected: {
        status: 403,
        body: {
          error: "AuthorizationError",
          code: 403,
          message: "Not allowed to access resource",
          details: {
            method: "GET",
            path: "/no-allow",
          },
        },
      },
    })

    assert({
      given: "route returns false in isAllowed",
      should: "return 403",
      actual: await GET(`${API_URL}/dont-allow`).catch(({ status, body }) => ({
        status,
        body,
      })),
      expected: {
        status: 403,
        body: {
          error: "AuthorizationError",
          code: 403,
          message: "Not allowed to access resource",
          details: {
            method: "GET",
            path: "/dont-allow",
          },
        },
      },
    })

    assert({
      given: "accept app/json on route that returns undefined",
      should: "return empty JSON object",
      actual: await GET(`${API_URL}/return-undefined`, {
        headers: {
          Accepts: "application/json",
        },
      }),
      expected: {},
    })

    assert({
      given: "accept text/plain on route that returns undefined",
      should: "return empty JSON object",
      actual: await GET(`${API_URL}/return-undefined`, {
        headers: {
          Accept: "text/plain",
        },
      }),
      expected: "",
    })

    assert({
      given: "route that returns null",
      should: "return empty JSON object",
      actual: await GET(`${API_URL}/return-undefined`),
      expected: {},
    })

    assert({
      given: "form encoded body and content type",
      should: "parse body with qs",
      actual: await POST(`${API_URL}/with-schema/mutant`, {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
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

    assert({
      given: "multipart/form-data with file field",
      should: "upload and save file localy",
      actual: await FORM_DATA(`${API_URL}/upload`, {
        body: {
          field: "testField",
          file: createReadStream(`${__dirname}/index.js`),
        },
      }).then(({ file }) => existsSync(file)),
      expected: true,
    })

    server.close()
  }

  {
    process.env.JWT_SECRET = "testing"

    const PORT = 4567
    const API_URL = `http://localhost:${PORT}`

    const [middleware] = await block({
      routes: [require("./routes/with-jwt.route")],
    })
    const server = http.createServer(middleware).listen(PORT, "localhost")

    assert({
      given: "invalid jwt in request headers",
      should: "return 409",
      actual: await GET(`${API_URL}/with-jwt`, {
        headers: {
          Authorization: "invalid-jwt",
        },
      }).catch(({ status, body }) => ({
        status,
        body,
      })),
      expected: {
        status: 409,
        body: {
          error: "InputValidationError",
          code: 409,
          message: "Invalid JWT",
          details: {
            method: "GET",
            path: "/with-jwt",
          },
        },
      },
    })

    assert({
      given: "valid jwt in request headers",
      should: "verify, parse and expose content to route action",
      actual: await GET(`${API_URL}/with-jwt`, {
        headers: {
          Authorization: jwt.sign(
            { foo: "bar", jti: "id-123" },
            process.env.JWT_SECRET
          ),
        },
      }),
      expected: {
        foo: "bar",
        jti: "id-123",
      },
    })

    server.close()
  }
})
