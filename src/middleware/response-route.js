export default ({ Router }) =>
  (request, response, next) => {
    Router.answer({
      req: request,
      route: request.ctx.route,
    })
      .then(answer => {
        response.ctx.status = answer.status
        response.ctx.payload = answer.payload

        return next()
      })
      .catch(next)
  }
