export default {
  method: "GET",
  path: "/no-authenticate",
  authorize: () => () => true,
  action: () => () => ({
    ping: "pong",
  }),
}
