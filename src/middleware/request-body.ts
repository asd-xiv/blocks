import path from "node:path"
import { tmpdir } from "node:os"
import { createWriteStream } from "node:fs"
import { IncomingMessage } from "node:http"
import slugify from "@sindresorhus/slugify"
import cuid from "cuid"
import busboy from "busboy"

import { InputError } from "../errors/input"
import { BlocksMiddlware } from "../core.types/middleware"

type HandleText = (
  request: IncomingMessage,
  options: {
    onParse: (input: string) => void
    onError: (error: Error) => void
  }
) => void

const handleText: HandleText = (request, { onParse, onError }) => {
  const chunks: Uint8Array[] = []

  request
    .on("data", chunk => chunks.push(chunk))
    .on("end", () => {
      try {
        onParse(Buffer.concat(chunks).toString())
      } catch (error) {
        onError(error)
      }
    })
}

type HandleForm = (
  request: IncomingMessage,
  options: {
    onParse: (input: Record<string, string>) => void
    onError: (error: Error) => void
  }
) => void

const handleForm: HandleForm = (request, { onParse, onError }) => {
  if (request.method !== "POST") {
    throw new Error("Use POST method when sending multipart data")
  }

  try {
    const bb = busboy({ headers: request.headers })
    const fields: Record<string, string> = {}
    const files: Record<string, string> = {}

    bb.on("field", (name, value) => {
      fields[name] = value
    })

    bb.on("file", (name, fileStream, fileInfo) => {
      const extension = path.extname(fileInfo.filename)
      const fileSlug = slugify(path.basename(fileInfo.filename, extension))
      const filePath = path.join(
        tmpdir(),
        `${fileSlug}-${cuid.slug()}${extension}`
      )

      fileStream.pipe(createWriteStream(filePath))
      files[name] = filePath
    })

    bb.on("finish", () => {
      onParse({ ...fields, ...files })
    })

    request.pipe(bb)
  } catch (error) {
    onError(error)
  }
}

const RequestBoddyParser: BlocksMiddlware =
  ({ QueryParser }) =>
  (request, response, next) => {
    switch (request.headers["x-content-type"]) {
      case "application/json":
        if (is(request.body)) {
          request.ctx.body = clone(request.body)
          next()
        } else {
          handleText(request, {
            onParse: input => {
              request.ctx.body = isEmpty(input) ? {} : JSON.parse(input)
              next()
            },
            onError: error =>
              next(new InputError("Invalid JSON string in body", error)),
          })
        }
        break

      case "application/x-www-form-urlencoded":
        handleText(request, {
          onParse: input => {
            request.ctx.body = QueryParser.parse(input)
            next()
          },
          onError: error =>
            next(new InputError("Invalid URL encoded string in body", error)),
        })
        break

      case "multipart/form-data":
        handleForm(request, {
          onParse: input => {
            request.ctx.body = input
            next()
          },
          onError: error =>
            next(new InputError("Invalid form data in body", error)),
        })
        break

      default:
        next(
          new InputError(
            `Can only parse request body for following content types: 'application/json', 'multipart/form-data' and 'application/x-www-form-urlencoded'. Received '${JSON.stringify(
              request.headers["content-type-parsed"]
            )}'`
          )
        )
    }
  }

export default RequestBoddyParser
