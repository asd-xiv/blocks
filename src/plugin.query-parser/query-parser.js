import qs from "qs"
import { is } from "@asd14/m"

export default {
  create: () => {
    const DELIMITER = process.env.QS_DELIMITER
    const ALLOW_DOTS = process.env.QS_ALLOW_DOTS
    const STRICT_NULL_HANDLING = process.env.QS_STRICT_NULL_HANDLING
    const ARRAY_FORMAT = process.env.QS_ARRAY_FORMAT

    return {
      parse: input =>
        qs.parse(input, {
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
