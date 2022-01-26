const debug = require("debug")("blocks:GoodbyeMiddleware")

const { read } = require("@asd14/m")
const accepts = require("accepts")

const toNowInMs = start => {
  const end = process.hrtime(start)

  return end[0] * 1000 + end[1] / 1_000_000
}

const acceptedContentTypes = ["json", "text"]

const bodyByRequestAccept = ({ accept, reponse }) => {
  const currentContentType = accept.type(acceptedContentTypes)

  switch (currentContentType) {
    case "json": {
      const payload = read(["ctx", "payload"], {}, reponse)

      reponse.setHeader("Content-Type", "application/json; charset=utf-8")

      return JSON.stringify(payload)
    }

    default: {
      const payload = read(["ctx", "payload"], "", reponse)

      reponse.setHeader("Content-Type", "text/plain; charset=utf-8")

      return payload
    }
  }
}

module.exports = () => (request, reponse) => {
  debug(
    `${request.method}:${request.url} responding with ${reponse.ctx.status}`
  )

  const body = bodyByRequestAccept({
    accept: accepts(request),
    reponse,
  })

  // time to respond in miliseconds
  reponse.setHeader("X-Response-Time", `${toNowInMs(request.ctx.startAt)} ms`)

  // count the number of octets, not chars
  reponse.setHeader("Content-Length", Buffer.byteLength(body, "utf8"))

  //
  reponse.writeHead(reponse.ctx.status)
  reponse.end(body, "utf8")
}
