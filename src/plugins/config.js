const debug = require("debug")("Blocks:ConfigPlugin")

import { is, isEmpty } from "@asd14/m"

export default {
  create: () => () => {
    const toBool = source => (isEmpty(source) ? null : source === "true")

    const {
      NAME,
      PORT,
      CORS_ORIGIN,
      CORS_METHODS,
      QS_DELIMITER,
      QS_ALLOW_DOTS,
      QS_STRICT_NULL_HANDLING,
      QS_ARRAY_FORMAT,
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
      AJV_ALL_ERRORS,
      AJV_COERCE_TYPES,
      AJV_USE_DEFAULTS,
    } = process.env

    return {
      STARTUP_TIME: new Date(),
      NAME: NAME ?? "blocks",
      PORT: is(PORT) ? Number(PORT) : 8000,

      // CORS support
      // github.com/expressjs/cors
      CORS_ORIGIN: isEmpty(CORS_ORIGIN) ? CORS_ORIGIN : CORS_ORIGIN.split(","),
      CORS_METHODS: isEmpty(CORS_METHODS)
        ? ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
        : CORS_METHODS.split(","),

      // Query string parsing
      // github.com/ljharb/qs
      QS_DELIMITER: QS_DELIMITER ?? "&",
      QS_ALLOW_DOTS: toBool(QS_ALLOW_DOTS) ?? true,
      QS_STRICT_NULL_HANDLING: toBool(QS_STRICT_NULL_HANDLING) ?? true,
      QS_ARRAY_FORMAT: QS_ARRAY_FORMAT ?? "brackets",

      // Help secure Express apps with various HTTP headers
      // github.com/helmetjs/helmet
      HELMET_CONTENT_SECURITY_POLICY:
        toBool(HELMET_CONTENT_SECURITY_POLICY) ?? false,
      HELMET_DNS_PREFETCH_CONTROL: toBool(HELMET_DNS_PREFETCH_CONTROL) ?? true,
      HELMET_EXPECT_CT: toBool(HELMET_EXPECT_CT) ?? false,
      HELMET_FEATURE_POLICY: toBool(HELMET_FEATURE_POLICY) ?? false,
      HELMET_FRAMEGUARD: toBool(HELMET_FRAMEGUARD) ?? true,
      HELMET_HIDE_POWER_BY: toBool(HELMET_HIDE_POWER_BY) ?? false,
      HELMET_HSTS: toBool(HELMET_HSTS) ?? true,
      HELMET_IE_NO_OPEN: toBool(HELMET_IE_NO_OPEN) ?? true,
      HELMET_NO_CACHE: toBool(HELMET_NO_CACHE) ?? true,
      HELMET_NO_SNIFF: toBool(HELMET_NO_SNIFF) ?? true,
      HELMET_CROSSDOMAIN: toBool(HELMET_CROSSDOMAIN) ?? true,
      HELMET_REFERER_POLICY: toBool(HELMET_REFERER_POLICY) ?? false,
      HELMET_XSS_FILTER: toBool(HELMET_XSS_FILTER) ?? true,

      // Request data validation with ajv
      // github.com/epoberezkin/ajv
      AJV_ALL_ERRORS: toBool(AJV_ALL_ERRORS) ?? true,
      AJV_COERCE_TYPES: toBool(AJV_COERCE_TYPES) ?? true,
      AJV_USE_DEFAULTS: toBool(AJV_USE_DEFAULTS) ?? true,
    }
  },
}
