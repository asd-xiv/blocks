import http from "node:http"
import glob from "glob"

import { block } from "../src/index.js"

const [middleware] = await block({
  plugins: glob.sync("../src/plugins/*.js", { absolute: true }),
  routes: glob.sync("../src/**/*.route.js", { absolute: true }),
})

http
  .createServer(middleware)
  .listen(process.env.PORT)
  .on("error", error => {
    console.log("Server error", error)
  })
  .on("listening", () => {
    console.log(`Server started on port ${process.env.PORT}`)
  })
