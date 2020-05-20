const debug = require("debug")("blocks:HelmetMiddleware")

const helmet = require("helmet")
const { get, when, same, pipe, is } = require("@mutant-ws/m")

const toBool = source => (is(source) ? source === "true" : null)

const getBool = (prop, _default) =>
  pipe(get(prop), when(is, toBool, same(_default)))(process.env)

module.exports = () => {
  return helmet({
    contentSecurityPolicy: false,
    dnsPrefetchControl: getBool("DNS_PREFETCH_CONTROL", true),
    expectCt: getBool("EXPECT_CT", false),
    featurePolicy: getBool("FEATURE_POLICY", false),
    frameguard: getBool("FRAMEGUARD", true),
    hidePoweredBy: getBool("HIDE_POWER_BY", false),
    hsts: getBool("HSTS", true),
    ieNoOpen: getBool("IE_NO_OPEN", true),
    noCache: getBool("NO_CACHE", true),
    noSniff: getBool("NO_SNIFF", true),
    permittedCrossDomainPolicies: getBool("CROSSDOMAIN", true),
    referrerPolicy: getBool("REFERER_POLICY", false),
    xssFilter: getBool("XSS_FILTER", true),
  })
}
