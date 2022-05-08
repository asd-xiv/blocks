import { IncomingMessage } from "node:http"
import { JSONSchemaType } from "ajv"

export type BlocksRouteSchema<
  H extends Record<string, unknown>,
  P extends Record<string, unknown>,
  Q extends Record<string, unknown>,
  B extends Record<string, unknown>
> = {
  headers?: JSONSchemaType<H>
  params?: JSONSchemaType<P>
  query?: JSONSchemaType<Q>
  body?: JSONSchemaType<B>
}

export type BlocksRoute = {
  method?: IncomingMessage["method"]

  path: string

  schema?: BlocksRouteSchema<
    unknown,
    Record<string, unknown>,
    Record<string, unknown>,
    Record<string, unknown>
  >

  authenticate: (
    plugins?: Record<string, any>
  ) => (request: IncomingMessage) => boolean

  authorize: (
    plugins?: Record<string, any>
  ) => (request: IncomingMessage) => boolean

  action: (
    plugins?: Record<string, any>
  ) => (request: IncomingMessage) => Record<string, any>
}
