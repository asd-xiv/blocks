const debug = require("debug")("blocks:HelmetMiddleware")

const helmet = require("helmet")
const { get, when, same, pipe, is } = require("@asd14/m")

const toBool = source => (is(source) ? source === "true" : null)

const getBool = (prop, _default) =>
  pipe(get(prop), when(is, toBool, same(_default)))(process.env)

module.exports = () => {
  return helmet({
    contentSecurityPolicy: false,
    expectCt: getBool("EXPECT_CT", false),
    referrerPolicy: getBool("REFERER_POLICY", false),
  })
}
