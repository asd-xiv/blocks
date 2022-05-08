import { BlocksRoute } from "../core.types/routes"

import schema from "./ping.schema"

const route: BlocksRoute = {
  method: "GET",
  path: "/ping",
  schema,
  authenticate: (/* plugins */) => (/* req */) => true,
  authorize: (/* plugins */) => (/* req */) => true,
  action: (/* plugins */) => (/* req */) => ({
    name: process.env.APP_NAME ?? "blocks",
    instanceId: process.env.pm_id ?? "just me",
    version: process.env.APP_VERSION,
    ping: "pong",
    startedAt: process.env.STARTUP_TIME,
  }),
}

export default route
