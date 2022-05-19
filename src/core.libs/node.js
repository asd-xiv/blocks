import { map, pipeP } from "@asd14/m"

export const importAll = pipeP(
  map(item => (typeof item === "string" ? import(item) : item)),
  items => Promise.all(items)
)
