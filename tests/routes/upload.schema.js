export default {
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
