/* eslint-disable new-cap,no-sync */

import http from "http"

import path from "path"
import jwt from "jsonwebtoken"
import { stringify } from "qs"

// import { describe } from "riteway"
import test from "tape"

import { createReadStream, existsSync } from "fs"
import { GET, PATCH, POST, MULTIPART, set } from "@asd14/fetch-node"

import { block } from "../src/index.js"

const PORT = 4567
const API_URL = `http://localhost:${PORT}`

const __dirname = path.resolve()

set({
  // Prefix request urls with API_URL
  baseURL: API_URL,

  /**
   * Transform query object into string with `qs`
   *
   * @param {object} source Request query object
   *
   * @param          input
   * @returns {string}        String appended to the URL
   */
  queryStringifyFn: input =>
    stringify(input, {
      allowDots: true,
      encode: false,
      arrayFormat: "brackets",
      strictNullHandling: true,
    }),
})

test("blocks :: init with defaults", async t => {
  {
    const routes = [
      "./routes/no-schema.route.js",
      "./routes/with-schema.route.js",
      "./routes/with-keywords.route.js",
      "./routes/no-authenticate.route.js",
      "./routes/no-authorize.route.js",
      "./routes/dont-authenticate.route.js",
      "./routes/dont-authorize.route.js",
      "./routes/authenticate-throws.route.js",
      "./routes/authorize-throws.route.js",
      "./routes/return-undefined.route.js",
      "./routes/upload.route.js",
      "./routes/custom-validator-fields.route.js",
    ].map(_path => import(_path))
    const [middleware, plugins] = await block({
      plugins: [
        path.resolve(__dirname, "plugins", "good.js"),
        path.resolve(__dirname, "plugins", "error.js"),
      ],
      routes,
      // [
      //  require("./routes/no-schema.route.js"),
      //  require("./routes/with-schema.route.js"),
      //  require("./routes/with-keywords.route.js"),
      //  require("./routes/no-authenticate.route.js"),
      //  require("./routes/no-authorize.route.js"),
      //  require("./routes/dont-authenticate.route.js"),
      //  require("./routes/dont-authorize.route.js"),
      //  require("./routes/authenticate-throws.route.js"),
      //  require("./routes/authorize-throws.route.js"),
      //  require("./routes/return-undefined.route.js"),
      //  require("./routes/upload.route.js"),
      //  require("./routes/custom-validator-fields.route.js"),
      // ],
    })

    t.equal(
      Object.keys(plugins).sort(),
      ["ErrorPlugin", "Good", "QueryParser", "Router"],
      "Given 1 custom plugin, it should load default plugins (Router, QueryParser) and custom"
    )

    t.equal(
      plugins.Router.count(),
      13,
      "Given 13 custom routes, it should load default /ping and all custom"
    )

    t.equal(
      middleware.stack.length,
      9,
      "Given no custom middleware, it should contain 9 middleware"
    )

    const server = http.createServer(middleware).listen(PORT, "localhost")

    t.equal(
      await GET(`${API_URL}/ping`).then(({ name, ping }) => ({
        name,
        ping,
      })),
      { name: "blocks", ping: "pong" },
      "Given default route /ping, it should response with pong"
    )

    t.equal(
      await PATCH(
        `${API_URL}/custom-validator/f81d4fae-7dec-11d0-a765-00a0c91e6bf6`,
        {
          query: {
            email: "foo@bar.com",
          },
          body: {
            thumbnailURL: "https://foo.bar.com",
            createdAt: "2021-01-29T09:50:31.840Z",
          },
        }
      ),
      {
        params: {
          id: "f81d4fae-7dec-11d0-a765-00a0c91e6bf6",
        },
        query: {
          email: "foo@bar.com",
        },
        body: {
          thumbnailURL: "https://foo.bar.com",
          createdAt: "2021-01-29T09:50:31.840Z",
        },
      },
      "Given route with custom validator in schema and valid req data, it should respond with mirrored data"
    )

    t.equal(
      await GET(`${API_URL}/not-exist`).catch(({ status, body }) => ({
        status,
        body,
      })),
      {
        status: 404,
        body: {
          error: "NotFoundError",
          message: "Endpoint GET:/not-exist not found",
        },
      },
      "Given route path does not exist, it should return 404"
    )

    t.equal(
      await GET(`${API_URL}/no-authenticate`).catch(({ status, body }) => ({
        status,
        body,
      })),
      {
        status: 401,
        body: {
          error: "AuthenticationError",
          message: "Need to be authenticated to access resource",
        },
      },
      "Given route without isAuthenticated defined, it should return 401"
    )

    t.equal(
      await GET(`${API_URL}/no-authorize`).catch(({ status, body }) => ({
        status,
        body,
      })),
      {
        status: 403,
        body: {
          error: "AuthorizationError",
          message: "Need permission to access resource",
        },
      },
      "Given route without isAuthorized defined, it should return 403"
    )

    t.equal(
      await GET(`${API_URL}/dont-authenticate`).catch(({ status, body }) => ({
        status,
        body,
      })),
      {
        status: 401,
        body: {
          error: "AuthenticationError",
          message: "Need to be authenticated to access resource",
        },
      },
      "Given route isAuthenticated returns false, it should return 401"
    )

    t.equal(
      await GET(`${API_URL}/is-authenticated-throws`).catch(
        ({ status, body }) => ({
          status,
          body,
        })
      ),
      {
        status: 401,
        body: {
          error: "AuthenticationError",
          message: "Trololo",
        },
      },
      "Given route isAuthenticated throws error, it should return 401"
    )

    t.equal(
      await GET(`${API_URL}/return-undefined`, {
        headers: {
          Accepts: "application/json",
        },
      }),
      {},
      "Given accept app/json on route that returns undefined, it should return empty JSON object"
    )

    t.equal(
      await GET(`${API_URL}/return-undefined`, {
        headers: {
          Accept: "text/plain",
        },
      }),
      "",
      "Given accept text/plain on route that returns undefined, it should return empty JSON object"
    )

    t.equal(
      await GET(`${API_URL}/return-undefined`),
      {},
      "Given route that returns null, it should return empty JSON object"
    )

    t.equal(
      await POST(`${API_URL}/with-schema/mutant?v=1`, {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        body: "parsed=with%20qs&another=value",
      }),
      {
        message: "Hello Plugin World!",
        params: { name: "mutant" },
        query: { v: 1 },
        body: { parsed: "with qs", another: "value" },
      },
      "Given form encoded body and content type, it should parse body with qs"
    )

    t.equal(
      await POST(`${API_URL}/with-keywords`, {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        body: "title=%20UP%20CASED%20&foo=foobar",
      }),
      {
        message: "Hello Plugin World!",
        query: {},
        params: {},
        body: { foo: "foobar", title: "up cased" },
      },
      "Given form encoded with custom keywords, it should validate input"
    )

    t.equal(
      await MULTIPART(`${API_URL}/upload`, {
        body: {
          field: "testField",
          file: createReadStream(`${__dirname}/index.js`),
        },
      }).then(({ file }) => existsSync(file)),
      true,
      "Given multipart/form-data with file field, it should upload and save file localy"
    )

    server.close()
  }

  {
    process.env.JWT_SECRET = "testing"

    const [middleware] = await block({
      routes: [import("./routes/with-jwt.route.js")],
    })
    const server = http.createServer(middleware).listen(PORT, "localhost")

    t.equal(
      await GET(`/with-jwt`, {
        headers: {
          Authorization: "invalid-jwt",
        },
      }).catch(({ status, body }) => ({
        status,
        body,
      })),
      {
        status: 401,
        body: {
          error: "AuthenticationError",
          message: "jwt malformed",
        },
      },
      "Given invalid jwt in request headers, it should return 401"
    )

    t.equal(
      await GET(`/with-jwt`, {
        headers: {
          Authorization: jwt.sign(
            { foo: "bar", jti: "id-123" },
            process.env.JWT_SECRET
          ),
        },
      }),
      {
        foo: "bar",
        jti: "id-123",
      },
      "Given valid jwt in request headers, it should verify, parse and expose content to route action"
    )

    server.close()
  }
})
