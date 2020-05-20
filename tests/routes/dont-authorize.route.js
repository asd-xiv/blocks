module.exports = {
  method: "GET",
  path: "/dont-authenticate",

  // 409 if invalid req.query, req.headers, req.params or req.body
  // schema: require("./schema"),

  // 401 if returns false or throws
  authenticate: (/* plugins */) => (/* req*/) => true,

  // 403 if returns false or throws
  authorize: (/* plugins */) => (/* req */) => false,

  action: (/* plugins */) => (/* req */) => ({
    ping: "pong",
  }),
}
