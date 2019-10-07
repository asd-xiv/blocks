const debug = require("debug")("Blocks:CORSMiddleware")

import cors from "cors"
import { isEmpty } from "@mutantlove/m"

module.exports = ({ Config: { CORS_ORIGIN, CORS_METHODS } }) =>
  isEmpty(CORS_ORIGIN)
    ? null
    : cors({
        origin: CORS_ORIGIN,
        methods: CORS_METHODS,

        // some legacy browsers (IE11, various SmartTVs) choke on 204
        optionsSuccessStatus: 200,
      })
