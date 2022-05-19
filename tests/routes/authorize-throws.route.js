export default {
  method: "GET",
  path: "/is-authorized-throws",
  authenticate: () => () => true,
  authorize: () => () => {
    throw new Error("Trololo")
  },
  action: () => () => ({
    ping: "pong",
  }),
}
