import http from "http"
import glob from "glob"

import { block } from "../src"

// initialize application
const app = block({
  // always scan relative to current folder
  plugins: glob.sync("./plugins/*.js", { cwd: __dirname, absolute: true }),
  routes: glob.sync("./**/*.route.js", { cwd: __dirname, absolute: true }),
})

// start node server
app
  .then(({ Plugins, middlewarePipeline }) => {
    const server = http.createServer(middlewarePipeline)

    server.listen(Plugins.Config.PORT)
  })
  .catch(error => {
    console.log("Server could not start", error)
  })
