const exports = {
  method: "POST",
  path: "/with-keywords",

  // 409 if invalid req.query, req.headers, req.params or req.body
  schema: import("./with-keywords.schema.js"),

  // 401 if returns false or throws
  authenticate: (/* plugins */) => (/* req */) => true,

  // 403 if returns false or throws
  authorize: (/* plugins */) => (/* req */) => true,

  action:
    ({ Good }) =>
    ({ ctx }) => {
      return {
        message: Good.getMessage(),
        params: ctx.params,
        query: ctx.query,
        body: ctx.body,
      }
    },
}

export default exports
