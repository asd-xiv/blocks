import cors from "cors"
import { is, isEmpty } from "@asd14/m"

export default () => {
  const ORIGIN = process.env.CORS_ORIGIN
  const METHODS = process.env.CORS_METHODS

  // Active middleware if CORS_ORIGIN present
  return isEmpty(ORIGIN)
    ? undefined
    : cors({
        origin: ORIGIN === "true" ? true : ORIGIN,
        methods: is(METHODS) ? METHODS : "GET,HEAD,PUT,PATCH,POST,DELETE",

        // Some legacy browsers (IE11, various SmartTVs) choke on 204
        optionsSuccessStatus: 200,
      })
}
