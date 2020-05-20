const http = require("http")
const glob = require("glob")

const { block } = require("../src")

// initialize application
const app = block({
  // always scan relative to current folder
  plugins: glob.sync("./plugins/*.js", { cwd: __dirname, absolute: true }),
  routes: glob.sync("./**/*.route.js", { cwd: __dirname, absolute: true }),
})

// start node server
app
  .then(([middleware, { Config }]) => {
    const server = http.createServer(middleware)

    server.listen({
      port: Config.PORT,
    })

    server.on("error", error => {
      console.log("Server error", error)
    })

    server.on("listening", () => {
      console.log(`Server started on port ${Config.PORT}`)
    })
  })
  .catch(error => {
    console.log("Application could not initialize", error)
  })
