const debug = require("debug")("Blocks:QueryMiddleware")

import qs from "qs"

module.exports = ({
  Config: {
    QS_DELIMITER,
    QS_ALLOW_DOTS,
    QS_STRICT_NULL_HANDLING,
    QS_ARRAY_FORMAT,
  },
}) => (req, res, next) => {
  req.ctx.query = qs.parse(req.ctx.query, {
    delimiter: QS_DELIMITER,
    allowDots: QS_ALLOW_DOTS,
    strictNullHandling: QS_STRICT_NULL_HANDLING,
    arrayFormat: QS_ARRAY_FORMAT,
  })

  next()
}
