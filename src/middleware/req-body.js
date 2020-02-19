const debug = require("debug")("Blocks:BodyMiddleware")

import cuid from "cuid"
import Busboy from "busboy"
import slugify from "@sindresorhus/slugify"
import { tmpdir } from "os"
import { pipe, isEmpty } from "@mutantlove/m"
import { createWriteStream } from "fs"
import { extname, basename, join } from "path"

import { InputValidationError } from "../errors/input"

const handleText = (req, { onParse, onError }) => {
  const chunks = []

  req
    .on("data", chunk => chunks.push(chunk))
    .on("end", () => {
      try {
        pipe(Buffer.concat, buffer => buffer.toString(), onParse)(chunks)
      } catch (error) {
        onError(error)
      }
    })
}

const handleForm = (req, { onParse, onError }) => {
  if (req.method !== "POST") {
    throw new Error("Use POST method when sending multipart data")
  }

  try {
    const busboy = new Busboy({ headers: req.headers })
    const fields = {}
    const files = {}

    busboy.on("field", (fieldname, val) => {
      fields[fieldname] = val
    })

    busboy.on("file", (fieldname, file, filename) => {
      const ext = extname(filename)
      const fileSlug = slugify(basename(filename, ext))
      const saveToPath = join(tmpdir(), `${fileSlug}-${cuid.slug()}${ext}`)

      file.pipe(createWriteStream(saveToPath))
      files[fieldname] = saveToPath
    })

    busboy.on("finish", () => {
      onParse({ ...fields, ...files })
    })

    req.pipe(busboy)
  } catch (error) {
    onError(error)
  }
}

module.exports = ({ QueryParser }) => (req, res, next) => {
  switch (req.headers["x-content-type"]) {
    case "application/json":
      return handleText(req, {
        onParse: source => {
          req.ctx.body = isEmpty(source) ? {} : JSON.parse(source)
          next()
        },
        onError: error =>
          next(new InputValidationError("Invalid JSON string in body", error)),
      })

    //
    case "application/x-www-form-urlencoded":
      return handleText(req, {
        next,
        onParse: source => {
          req.ctx.body = QueryParser.parse(source)
          next()
        },
        onError: error =>
          next(
            new InputValidationError(
              "Invalid URL encoded string in body",
              error
            )
          ),
      })

    //
    case "multipart/form-data":
      return handleForm(req, {
        onParse: source => {
          req.ctx.body = source
          next()
        },
        onError: error =>
          next(new InputValidationError("Invalid form data in body", error)),
      })

    //
    default:
      next(
        new InputValidationError(
          `Can only parse request body for following content types: 'application/json', 'multipart/form-data' and 'application/x-www-form-urlencoded'. Received '${JSON.stringify(
            req.headers["content-type-parsed"]
          )}'`
        )
      )
  }
}
