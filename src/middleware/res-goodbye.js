const debug = require("debug")("blocks:GoodbyeMiddleware")

const { read } = require("@asd14/m")
const accepts = require("accepts")

const toNowInMs = start => {
  const end = process.hrtime(start)

  return end[0] * 1000 + end[1] / 1000000
}

const acceptedContentTypes = ["json", "text"]

const bodyByRequestAccept = ({ accept, res }) => {
  const currentContentType = accept.type(acceptedContentTypes)

  switch (currentContentType) {
    case "json": {
      const payload = read(["ctx", "payload"], {}, res)

      res.setHeader("Content-Type", "application/json")

      return JSON.stringify(payload)
    }

    default: {
      const payload = read(["ctx", "payload"], "", res)

      res.setHeader("Content-Type", "text/plain")

      return payload
    }
  }
}

module.exports = () => (req, res) => {
  debug(`${req.method}:${req.url} responding with ${res.ctx.status}`)

  const body = bodyByRequestAccept({
    accept: accepts(req),
    res,
  })

  // time to respond in miliseconds
  res.setHeader("X-Response-Time", `${toNowInMs(req.ctx.startAt)} ms`)

  // count the number of octets, not chars
  res.setHeader("Content-Length", Buffer.byteLength(body, "utf8"))

  //
  res.writeHead(res.ctx.status)
  res.end(body, "utf8")
}
