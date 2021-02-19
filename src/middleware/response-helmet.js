const debug = require("debug")("blocks:HelmetMiddleware")

const helmet = require("helmet")

module.exports = () => {
  return helmet({
    contentSecurityPolicy: false,
    expectCt: process.env.EXPECT_CT,
    referrerPolicy: process.env.REFERER_POLICY,
  })
}
