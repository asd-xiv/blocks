import { isEmpty } from "@asd14/m"

export default ({ QueryParser }) =>
  (request, response, next) => {
    request.ctx.query = isEmpty(request.ctx.query)
      ? {}
      : QueryParser.parse(request.ctx.query)

    next()
  }
