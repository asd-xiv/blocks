export default {
  method: "GET",
  path: "/return-undefined",
  authenticate: () => () => true,
  authorize: () => () => true,
  action: () => () => {},
}
