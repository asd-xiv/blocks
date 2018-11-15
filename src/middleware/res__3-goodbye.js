const debug = require("debug")("Blocks:GoodbyeMiddleware")
const { forEach } = require("@asd14/m")

module.exports = () => (req, res) => {
  debug(`${req.method}:${req.url} responding with ${res.ctx.status}`)

  const body = JSON.stringify(res.ctx.payload || {})
  const endAt = process.hrtime(req.ctx.startAt)

  forEach(([name, value]) => res.setHeader(name, value))([
    // https://helmetjs.github.io/docs/dont-sniff-mimetype/
    ["X-Content-Type-Options", "nosniff"],

    // https://helmetjs.github.io/docs/frameguard/
    ["X-Frame-Options", "DENY"],

    // https://helmetjs.github.io/docs/dns-prefetch-control/
    ["X-DNS-Prefetch-Control", "off"],

    // https://helmetjs.github.io/docs/referrer-policy/
    ["Referrer-Policy", "same-origin"],

    // https://helmetjs.github.io/docs/hsts/
    ["Strict-Transport-Security", "max-age=5184000"],

    // https://helmetjs.github.io/docs/ienoopen/
    ["X-Download-Options", "noopen"],

    // No cache
    ["Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate"],
    ["Pragma", "no-cache"],
    ["Expires", "0"],

    // from the first middleware to now
    ["X-Response-Time", `${endAt[0]}s ${endAt[1] / 1000000}ms`],

    ["Content-Type", "application/json; charset=utf-8"],
    ["Content-Length", Buffer.byteLength(body, "utf8")],
  ])

  res.writeHead(res.ctx.status)
  res.end(body, "utf8")
}
