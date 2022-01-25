const exports = {
  method: "GET",
  path: "/return-undefined",

  // 409 if invalid req.query, req.headers, req.params or req.body
  // schema: import("./schema"),

  // 401 if returns false or throws
  authenticate: (/* plugins */) => (/* req */) => true,

  // 403 if returns false or throws
  authorize: (/* plugins */) => (/* req */) => true,

  action: (/* plugins */) => (/* req */) => {},
}

export default exports
