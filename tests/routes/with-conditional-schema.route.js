import schema from "./with-conditional-schema.schema.js"

export default {
  method: "POST",
  path: "/with-conditional-schema",
  schema,
  authenticate: (/* plugins */) => (/* req */) => true,
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
