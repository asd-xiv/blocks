const debug = require("debug")("Blocks:GoodbyeMiddleware")

import { forEach, is } from "@mutantlove/m"

module.exports = () => (req, res) => {
  debug(`${req.method}:${req.url} responding with ${res.ctx.status}`)

  const payload = is(res.ctx.payload) ? res.ctx.payload : {}
  const isObject = typeof payload === "object"
  const endAt = process.hrtime(req.ctx.startAt)

  const body = isObject ? JSON.stringify(payload) : payload
  const contentType = isObject
    ? "application/json; charset=utf-8"
    : "text/plain; charset=utf-8"

  forEach(([name, value]) => res.setHeader(name, value))([
    // from the first middleware to now
    ["X-Response-Time", `${endAt[0]}s ${endAt[1] / 1000000}ms`],
    ["Content-Type", contentType],
    ["Content-Length", Buffer.byteLength(body, "utf8")],
  ])

  res.writeHead(res.ctx.status)
  res.end(body, "utf8")
}
