const debug = require("debug")("blocks:BodyMiddleware")

const cuid = require("cuid")
const Busboy = require("busboy")
const slugify = require("@sindresorhus/slugify")
const { tmpdir } = require("os")
const { pipe, is, isEmpty, clone } = require("@asd14/m")
const { createWriteStream } = require("fs")
const path = require("path")

const { InputError } = require("../errors/input")

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

module.exports = ({ QueryParser }) => (request, response, next) => {
  switch (request.headers["x-content-type"]) {
    //
    case "application/json":
      if (is(request.body)) {
        request.ctx.body = clone(request.body)
        next()
      } else {
        handleText(request, {
          onParse: source => {
            request.ctx.body = isEmpty(source) ? {} : JSON.parse(source)
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
        onParse: source => {
          request.ctx.body = QueryParser.parse(source)
          next()
        },
        onError: error =>
          next(new InputError("Invalid URL encoded string in body", error)),
      })

    //
    case "multipart/form-data":
      return handleForm(request, {
        onParse: source => {
          request.ctx.body = source
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
