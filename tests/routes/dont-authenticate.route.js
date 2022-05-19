export default {
  method: "GET",
  path: "/dont-authenticate",
  authenticate: () => () => false,
  authorize: () => () => true,
  action: () => () => ({
    ping: "pong",
  }),
}
