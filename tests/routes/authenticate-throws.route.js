export default {
  method: "GET",
  path: "/is-authenticated-throws",
  authenticate: () => () => {
    throw new Error("Trololo")
  },
  authorize: () => () => true,
  action: () => () => ({
    ping: "pong",
  }),
}
