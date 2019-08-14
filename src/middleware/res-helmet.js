const debug = require("debug")("Blocks:HelmetMiddleware")

import helmet from "helmet"

module.exports = ({
  Config: {
    HELMET_CONTENT_SECURITY_POLICY,
    HELMET_DNS_PREFETCH_CONTROL,
    HELMET_EXPECT_CT,
    HELMET_FEATURE_POLICY,
    HELMET_FRAMEGUARD,
    HELMET_HIDE_POWER_BY,
    HELMET_HSTS,
    HELMET_IE_NO_OPEN,
    HELMET_NO_CACHE,
    HELMET_NO_SNIFF,
    HELMET_CROSSDOMAIN,
    HELMET_REFERER_POLICY,
    HELMET_XSS_FILTER,
  },
}) =>
  helmet({
    contentSecurityPolicy: HELMET_CONTENT_SECURITY_POLICY,
    dnsPrefetchControl: HELMET_DNS_PREFETCH_CONTROL,
    expectCt: HELMET_EXPECT_CT,
    featurePolicy: HELMET_FEATURE_POLICY,
    frameguard: HELMET_FRAMEGUARD,
    hidePoweredBy: HELMET_HIDE_POWER_BY,
    hsts: HELMET_HSTS,
    ieNoOpen: HELMET_IE_NO_OPEN,
    noCache: HELMET_NO_CACHE,
    noSniff: HELMET_NO_SNIFF,
    permittedCrossDomainPolicies: HELMET_CROSSDOMAIN,
    referrerPolicy: HELMET_REFERER_POLICY,
    xssFilter: HELMET_XSS_FILTER,
  })
