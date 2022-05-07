import cuid from "cuid"
import Busboy from "busboy"
import slugify from "@sindresorhus/slugify"
import { tmpdir } from "os"
import { pipe, is, isEmpty, clone } from "@asd14/m"
import { createWriteStream } from "fs"
import path from "path"

import { InputError } from "../errors/input.js"

const handleText = (request, { onParse, onError }) => {
  const chunks = []

  request
    .on("data", chunk => chunks.push(chunk))
    .on("end", () => {
      try {
        pipe(Buffer.concat, buffer => buffer.toString(), onParse)(chunks)
      } catch (error) {
        onError(error)
      }
    })
}

const handleForm = (request, { onParse, onError }) => {
  if (request.method !== "POST") {
    throw new Error("Use POST method when sending multipart data")
  }

  try {
    const busboy = new Busboy({ headers: request.headers })
    const fields = {}
    const files = {}

    busboy.on("field", (fieldname, value) => {
      fields[fieldname] = value
    })

    busboy.on("file", (fieldname, file, filename) => {
      const extension = path.extname(filename)
      const fileSlug = slugify(path.basename(filename, extension))
      const saveToPath = path.join(
        tmpdir(),
        `${fileSlug}-${cuid.slug()}${extension}`
      )

      file.pipe(createWriteStream(saveToPath))
      files[fieldname] = saveToPath
    })

    busboy.on("finish", () => {
      onParse({ ...fields, ...files })
    })

    request.pipe(busboy)
  } catch (error) {
    onError(error)
  }
}

export default
  ({ QueryParser }) =>
  (request, response, next) => {
    switch (request.headers["x-content-type"]) {
      //
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

      //
      case "application/x-www-form-urlencoded":
        return handleText(request, {
          next,
          onParse: input => {
            request.ctx.body = QueryParser.parse(input)
            next()
          },
          onError: error =>
            next(new InputError("Invalid URL encoded string in body", error)),
        })

      //
      case "multipart/form-data":
        return handleForm(request, {
          onParse: input => {
            request.ctx.body = input
            next()
          },
          onError: error =>
            next(new InputError("Invalid form data in body", error)),
        })

      //
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
