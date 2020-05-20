const debug = require("debug")("blocks:CORSMiddleware")

const cors = require("cors")
const { is, isEmpty } = require("@mutant-ws/m")

module.exports = () => {
  const ORIGIN = process.env.CORS_ORIGIN
  const METHODS = process.env.CORS_METHODS

  return isEmpty(ORIGIN)
    ? null
    : cors({
        origin: ORIGIN === "true" ? true : ORIGIN,
        methods: is(METHODS) ? METHODS : "GET,HEAD,PUT,PATCH,POST,DELETE",

        // some legacy browsers (IE11, various SmartTVs) choke on 204
        optionsSuccessStatus: 200,
      })
}
