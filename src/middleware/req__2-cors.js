const debug = require("debug")("Blocks:CORSMiddleware")
const cors = require("cors")

module.exports = ({ Config }) =>
  cors({
    origin: Config.get("CORS_ORIGIN"),
    methods: Config.get("CORS_METHODS"),
  })
