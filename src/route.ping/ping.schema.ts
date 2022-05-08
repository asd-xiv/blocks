import { BlocksRouteSchema } from "../core.types/routes"

type Headers = Record<string, unknown>
type Params = Record<string, unknown>
type Query = Record<string, unknown>
type Body = { test?: number }

const schema: BlocksRouteSchema<Headers, Params, Query, Body> = {
  headers: {
    type: "object",
    additionalProperties: true,
  },

  params: {
    type: "object",
    additionalProperties: false,
  },

  query: {
    type: "object",
    additionalProperties: false,
  },

  body: {
    type: "object",
    additionalProperties: false,
    properties: {
      test: {
        type: "number",
        nullable: true,
      },
    },
  },
}

export default schema
