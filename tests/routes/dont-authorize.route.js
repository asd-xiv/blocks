export default {
  method: "GET",
  path: "/dont-authenticate",
  authenticate: () => () => true,
  authorize: () => () => false,
  action: () => () => ({
    ping: "pong",
  }),
}
