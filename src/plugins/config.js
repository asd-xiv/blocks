const debug = require("debug")("Blocks:ConfigPlugin")

import { when, i, same, is, isEmpty } from "@mutantlove/m"

export default {
  create: () => () => {
    const toBool = source => (isEmpty(source) ? null : source === "true")

    const {
      NAME,
      PORT,
      JWT_SECRET,
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
      NAME: when(is, i, same("blocks"))(NAME),
      PORT: is(PORT) ? Number(PORT) : 8000,

      // JWT support
      // github.com/auth0/node-jsonwebtoken
      JWT_SECRET,

      // CORS support
      // github.com/expressjs/cors
      CORS_ORIGIN: isEmpty(CORS_ORIGIN) ? CORS_ORIGIN : CORS_ORIGIN.split(","),
      CORS_METHODS: isEmpty(CORS_METHODS)
        ? ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
        : CORS_METHODS.split(","),

      // Query string parsing
      // github.com/ljharb/qs
      QS_DELIMITER: when(isEmpty, same("&"))(QS_DELIMITER),
      QS_ALLOW_DOTS: when(isEmpty, same(true))(toBool(QS_ALLOW_DOTS)),
      QS_STRICT_NULL_HANDLING: when(isEmpty, same(true))(
        toBool(QS_STRICT_NULL_HANDLING)
      ),
      QS_ARRAY_FORMAT: when(isEmpty, same("brackets"))(QS_ARRAY_FORMAT),

      // Help secure Express apps with various HTTP headers
      // github.com/helmetjs/helmet
      HELMET_CONTENT_SECURITY_POLICY: when(isEmpty, same(false))(
        toBool(HELMET_CONTENT_SECURITY_POLICY)
      ),
      HELMET_DNS_PREFETCH_CONTROL: when(isEmpty, same(true))(
        toBool(HELMET_DNS_PREFETCH_CONTROL)
      ),
      HELMET_EXPECT_CT: when(isEmpty, same(false))(toBool(HELMET_EXPECT_CT)),
      HELMET_FEATURE_POLICY: when(isEmpty, same(false))(
        toBool(HELMET_FEATURE_POLICY)
      ),
      HELMET_FRAMEGUARD: when(isEmpty, same(true))(toBool(HELMET_FRAMEGUARD)),
      HELMET_HIDE_POWER_BY: when(isEmpty, same(false))(
        toBool(HELMET_HIDE_POWER_BY)
      ),
      HELMET_HSTS: when(isEmpty, same(true))(toBool(HELMET_HSTS)),
      HELMET_IE_NO_OPEN: when(isEmpty, same(true))(toBool(HELMET_IE_NO_OPEN)),
      HELMET_NO_CACHE: when(isEmpty, same(true))(toBool(HELMET_NO_CACHE)),
      HELMET_NO_SNIFF: when(isEmpty, same(true))(toBool(HELMET_NO_SNIFF)),
      HELMET_CROSSDOMAIN: when(isEmpty, same(true))(toBool(HELMET_CROSSDOMAIN)),
      HELMET_REFERER_POLICY: when(isEmpty, same(false))(
        toBool(HELMET_REFERER_POLICY)
      ),
      HELMET_XSS_FILTER: when(isEmpty, same(true))(toBool(HELMET_XSS_FILTER)),

      // Request data validation with ajv
      // github.com/epoberezkin/ajv
      AJV_ALL_ERRORS: when(isEmpty, same(true))(toBool(AJV_ALL_ERRORS)),
      AJV_COERCE_TYPES: when(isEmpty, same(true))(toBool(AJV_COERCE_TYPES)),
      AJV_USE_DEFAULTS: when(isEmpty, same(true))(toBool(AJV_USE_DEFAULTS)),
    }
  },
}
