export default {
  method: "GET",
  path: "/no-authorize",
  authenticate: () => () => true,
  action: () => () => ({
    ping: "pong",
  }),
}
