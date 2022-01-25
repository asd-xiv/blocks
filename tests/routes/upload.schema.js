/**
 * foo: {
 * type: "string",
 * pattern: "^[a-z0-9-]+$",
 * maxLength: 25,
 * minLength: 25,
 * },
 *
 * limit: {
 * type: "integer",
 * minimum: 1,
 * maximum: 100,
 * default: 20,
 * },
 *
 * bar: {
 * type: "string",
 * enum: ["lorem", "dolor", "bobby"],
 * },
 *
 * ipsum: {
 * type: ["integer", "null"],
 * enum: ["lorem", "dolor", "bobby"],
 * },
 *
 * id: {
 * oneOf: [
 * { type: "integer" },
 * {
 * type: "array",
 * items: { type: "integer" },
 * minItems: 1,
 * uniqueItems: true,
 * },
 * ],
 * },
 */

const exports = {
  headers: {
    type: "object",
    required: ["x-content-type"],
    properties: {
      "x-content-type": {
        enum: ["multipart/form-data"],
      },
    },
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
    required: ["field", "file"],
    properties: {
      field: { type: "string" },
      file: { type: "string" },
    },
  },
}

export default exports
