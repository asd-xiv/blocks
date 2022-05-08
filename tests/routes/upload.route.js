const exports = {
  method: "POST",
  path: "/upload",

  // 409 if invalid req.query, req.headers, req.params or req.body
  schema: await import("./upload.schema.js"),

  // 401 if returns false or throws
  authenticate: (/* plugins */) => (/* req */) => true,

  // 403 if returns false or throws
  authorize: (/* plugins */) => (/* req */) => true,

  action:
    (/* plugins */) =>
    ({ ctx: { body } }) => {
      return {
        file: body.file,
      }
    },
}

export default exports
