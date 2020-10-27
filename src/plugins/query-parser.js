const debug = require("debug")("blocks:QueryParserPlugin")

const qs = require("qs")
const { is } = require("@asd14/m")

module.exports = {
  create: () => {
    const DELIMITER = process.env.QS_DELIMITER
    const ALLOW_DOTS = process.env.QS_ALLOW_DOTS
    const STRICT_NULL_HANDLING = process.env.QS_STRICT_NULL_HANDLING
    const ARRAY_FORMAT = process.env.QS_ARRAY_FORMAT

    return {
      parse: source =>
        qs.parse(source, {
          delimiter: is(DELIMITER) ? DELIMITER : "&",
          allowDots: is(ALLOW_DOTS) ? ALLOW_DOTS === "true" : true,
          strictNullHandling: is(STRICT_NULL_HANDLING)
            ? STRICT_NULL_HANDLING === "true"
            : true,
          comma: is(ARRAY_FORMAT) ? ARRAY_FORMAT : "brackets",
        }),
    }
  },
}
