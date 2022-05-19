export default {
  method: "GET",
  path: "/no-schema",
  authenticate: () => () => false,
  authorize: () => () => true,
  action: () => () => ({
    message: "Default json schema works!",
  }),
}
