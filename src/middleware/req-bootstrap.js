const debug = require("debug")("Blocks:BootstrapMiddleware")

import cuid from "cuid"
import { pick } from "@asd14/m"

module.exports = () => (req, res, next) => {
  req.ctx = {
    id: cuid(),
    startAt: process.hrtime(),
    ...pick(["query", "pathname"])(req._parsedUrl),
  }
  res.ctx = {}

  next()
}
