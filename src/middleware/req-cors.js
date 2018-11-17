const debug = require("debug")("Blocks:CORSMiddleware")
const cors = require("cors")

module.exports = ({ Config }) =>
  cors({
    origin: Config.get("CORS_ORIGIN"),
    methods: Config.get("CORS_METHODS"),

    // some legacy browsers (IE11, various SmartTVs) choke on 204
    optionsSuccessStatus: 200,
  })
