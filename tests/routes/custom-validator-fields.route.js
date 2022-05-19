import schema from "./custom-validator-fields.schema.js"

export default {
  method: "PATCH",
  path: "/custom-validator/:id",
  schema,
  authenticate: () => () => true,
  authorize: () => () => true,
  action:
    () =>
    ({ ctx: { query, params, body } }) => {
      return {
        query,
        params,
        body,
      }
    },
}
