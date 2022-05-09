import schema from "./upload.schema.js"

export default {
  method: "POST",
  path: "/upload",
  schema,
  authenticate: () => () => true,
  authorize: () => () => true,
  action:
    () =>
    ({ ctx: { body } }) => {
      return {
        file: body.file,
      }
    },
}
