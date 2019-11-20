const debug = require("debug")("Blocks:HelmetMiddleware")

import helmet from "helmet"

module.exports = () => {
  const CONTENT_SECURITY_POLICY = process.env.HELMET_CONTENT_SECURITY_POLICY
  const DNS_PREFETCH_CONTROL = process.env.HELMET_DNS_PREFETCH_CONTROL
  const EXPECT_CT = process.env.HELMET_EXPECT_CT
  const FEATURE_POLICY = process.env.HELMET_FEATURE_POLICY
  const FRAMEGUARD = process.env.HELMET_FRAMEGUARD
  const HIDE_POWER_BY = process.env.HELMET_HIDE_POWER_BY
  const HSTS = process.env.HELMET_HSTS
  const IE_NO_OPEN = process.env.HELMET_IE_NO_OPEN
  const NO_CACHE = process.env.HELMET_NO_CACHE
  const NO_SNIFF = process.env.HELMET_NO_SNIFF
  const CROSSDOMAIN = process.env.HELMET_CROSSDOMAIN
  const REFERER_POLICY = process.env.HELMET_REFERER_POLICY
  const XSS_FILTER = process.env.HELMET_XSS_FILTER

  return helmet({
    contentSecurityPolicy: CONTENT_SECURITY_POLICY,
    dnsPrefetchControl: DNS_PREFETCH_CONTROL,
    expectCt: EXPECT_CT,
    featurePolicy: FEATURE_POLICY,
    frameguard: FRAMEGUARD,
    hidePoweredBy: HIDE_POWER_BY,
    hsts: HSTS,
    ieNoOpen: IE_NO_OPEN,
    noCache: NO_CACHE,
    noSniff: NO_SNIFF,
    permittedCrossDomainPolicies: CROSSDOMAIN,
    referrerPolicy: REFERER_POLICY,
    xssFilter: XSS_FILTER,
  })
}
