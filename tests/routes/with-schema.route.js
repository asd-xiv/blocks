import schema from "./with-schema.schema.js"

export default {
  method: "POST",
  path: "/with-schema/:name",
  schema,
  authenticate: () => () => true,
  authorize: () => () => true,
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
