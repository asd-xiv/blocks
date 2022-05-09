import cuid from "cuid"
import contentType from "content-type"
import { pluck } from "@asd14/m"

export default () => (request, response, next) => {
  request.ctx = {
    id: cuid(),
    startAt: process.hrtime(),
    body: {},
    ...pluck(["query", "pathname"], request._parsedUrl),
  }

  try {
    request.headers["x-content-type"] = contentType.parse(
      request.headers["content-type"]
    ).type
  } catch {
    // Do nothing, let JSON schemas handle the validation
    request.headers["x-content-type"] = request.headers["content-type"]
  }

  response.ctx = {}

  next()
}
