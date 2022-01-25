const exports = {
  method: "GET",
  path: "/is-authenticated-throws",

  // 409 if invalid req.query, req.headers, req.params or req.body
  // schema: import("./schema"),

  // 401 if returns false or throws
  authenticate: () => () => {
    throw new Error("Trololo")
  },

  // 403 if returns false or throws
  authorize: (/* plugins */) => (/* req */) => true,

  action: (/* plugins */) => (/* req */) => ({
    ping: "pong",
  }),
}

export default exports
