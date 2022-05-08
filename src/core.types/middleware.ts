import { NextHandleFunction } from "connect"

export type BlocksMiddleware = (
  plugins: Record<string, any>
) => NextHandleFunction
