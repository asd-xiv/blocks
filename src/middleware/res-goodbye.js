const debug = require("debug")("blocks:GoodbyeMiddleware")

const { get, is } = require("@asd14/m")
const accepts = require("accepts")

const toNowInMs = start => {
  const end = process.hrtime(start)

  return end[0] * 1000 + end[1] / 1000000
}

const bodyByAccept = ({ accept, res }) => {
  const payload = get(["ctx", "payload"])(res)

  switch (accept.type(["json", "text"])) {
    case "json":
      res.setHeader("Content-Type", "application/json")

      return JSON.stringify(is(payload) ? payload : {})
    default:
      // the fallback is text/plain, so no need to specify it above
      res.setHeader("Content-Type", "text/plain")

      return is(payload) ? payload : ""
  }
}

module.exports = () => (req, res) => {
  debug(`${req.method}:${req.url} responding with ${res.ctx.status}`)

  const body = bodyByAccept({
    accept: accepts(req),
    res,
  })
  const startAt = get(["ctx", "startAt"])(req)
  const status = get(["ctx", "status"])(res)

  // time to respond in miliseconds
  res.setHeader("X-Response-Time", `${toNowInMs(startAt)} ms`)

  // count the number of octets, not chars
  res.setHeader("Content-Length", Buffer.byteLength(body, "utf8"))

  res.writeHead(status)
  res.end(body, "utf8")
}
