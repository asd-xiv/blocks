import { elapsedTime, is } from "@asd14/m"

import schema from "./ping.schema.js"

export default {
  method: "GET",
  path: "/ping",
  schema,
  authenticate: () => () => true,
  authorize: () => () => true,
  action: () => () => ({
    name: is(process.env.APP_NAME) ? process.env.APP_NAME : "@asd14/blocks",
    instance: is(process.env.pm_id) ? process.env.pm_id : "just me",
    version: process.env.APP_VERSION,
    ping: "pong",
    aliveFor: elapsedTime(process.env.STARTUP_TIME)(new Date()),
  }),
}
