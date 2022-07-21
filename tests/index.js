/* eslint-disable new-cap */

import http from "node:http"
import path from "node:path"
import { createReadStream, existsSync } from "node:fs"

import jwt from "jsonwebtoken"
import test from "tape"
import fetchNode from "@asd14/fetch-node"
import { stringify } from "qs"

import { block } from "../src/index.js"

const __dirname = new URL(".", import.meta.url).pathname
const { GET, PATCH, POST, MULTIPART, set: setHTTPProperties } = fetchNode
const PORT = 4567
const API_URL = `http://localhost:${PORT}`

setHTTPProperties({
  baseURL: API_URL,
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
    const [middleware, plugins] = await block({
      plugins: [
        path.resolve(__dirname, "plugins", "good.js"),
        path.resolve(__dirname, "plugins", "error.js"),
      ],
      routes: [
        await import("./routes/no-schema.route.js"),
        await import("./routes/with-schema.route.js"),
        await import("./routes/with-keywords.route.js"),
        await import("./routes/with-conditional-schema.route.js"),
        await import("./routes/no-authenticate.route.js"),
        await import("./routes/no-authorize.route.js"),
        await import("./routes/dont-authenticate.route.js"),
        await import("./routes/dont-authorize.route.js"),
        await import("./routes/authenticate-throws.route.js"),
        await import("./routes/authorize-throws.route.js"),
        await import("./routes/return-undefined.route.js"),
        await import("./routes/upload.route.js"),
        await import("./routes/custom-validator-fields.route.js"),
      ],
    })

    t.deepEquals(
      Object.keys(plugins).sort(),
      ["ErrorPlugin", "Good", "QueryParser", "Router"],
      "given [1 custom plugin] should [load default plugins (Router, QueryParser) and custom]"
    )

    t.deepEquals(
      plugins.Router.count(),
      14,
      "given [13 custom routes] should [load default /ping and all custom]"
    )

    t.deepEquals(
      middleware.stack.length,
      9,
      "given [no custom middleware] should [contain 9 middleware]"
    )

    const server = http.createServer(middleware).listen(PORT, "localhost")

    t.deepEquals(
      await GET(`${API_URL}/ping`).then(({ name, ping }) => ({
        name,
        ping,
      })),
      { name: "@asd14/blocks", ping: "pong" },
      "given [default route /ping] should [response with pong]"
    )

    t.deepEquals(
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
      "given [route with custom validator in schema and valid req data] should [respond with mirrored data]"
    )

    t.deepEquals(
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
      "given [route path does not exist] should [return 404]"
    )

    t.deepEqual(
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
      "given [route without isAuthenticated defined] should [return 401]"
    )

    t.deepEqual(
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
      "given [route without isAuthorized defined] should [return 403]"
    )

    t.deepEqual(
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
      "given [route isAuthenticated returns false] should [return 401]"
    )

    t.deepEqual(
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
      "given [route isAuthenticated throws error] should [return 401]"
    )

    t.deepEqual(
      await GET(`${API_URL}/return-undefined`, {
        headers: {
          Accepts: "application/json",
        },
      }),
      {},
      "given [accept app/json on route that returns undefined] should [return empty JSON object]"
    )

    t.deepEqual(
      await GET(`${API_URL}/return-undefined`, {
        headers: {
          Accept: "text/plain",
        },
      }),
      "",
      "given [accept text/plain on route that returns undefined] should [return empty JSON object]"
    )

    t.deepEqual(
      await GET(`${API_URL}/return-undefined`),
      {},
      "given [route that returns null] should [return empty JSON object]"
    )

    t.deepEqual(
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
      "given [form encoded body and content type] should [parse body with qs]"
    )

    t.deepEqual(
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
      "given [form encoded with custom keywords] should [transform and validate data inside schema with added functionalities from ajv-keywords]",
    )

    t.deepEqual(
      await POST(`${API_URL}/with-conditional-schema`, {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "x-api-version": "1.0.0",
        },
        body: "foo=1",
      }),
      {
        message: "Hello Plugin World!",
        query: {},
        params: {},
        body: { foo: "1" },
      },
      "given [a versioned schema based on header] should [use one schema or the other based on the API header value]",
    )

    t.deepEqual(
      await POST(`${API_URL}/with-conditional-schema`, {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "x-api-version": "2.4.0",
        },
        body: "foo=1",
      }),
      {
        message: "Hello Plugin World!",
        query: {},
        params: {},
        body: { foo: 1 },
      },
      "given [a versioned schema based on header] should [use one schema or the other based on the API header value]",
    )

    t.deepEqual(
      await MULTIPART(`${API_URL}/upload`, {
        body: {
          field: "testField",
          file: createReadStream(`${__dirname}/index.js`),
        },
      }).then(({ file }) => existsSync(file)),
      true,
      "given [multipart/form-data with file field] should [upload and save file localy]"
    )

    server.close()
  }

  {
    process.env.JWT_SECRET = "testing"

    const [middleware] = await block({
      routes: [await import("./routes/with-jwt.route.js")],
    })
    const server = http.createServer(middleware).listen(PORT, "localhost")

    t.deepEqual(
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
      "given [invalid jwt in request headers] should [return 401]"
    )

    t.deepEqual(
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
      "given [valid jwt in request headers] should [verify, parse and expose content to route action]"
    )

    server.close()
  }
})
