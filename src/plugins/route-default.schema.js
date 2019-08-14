module.exports = {
  headers: {
    type: "object",
    required: ["content-type"],
    properties: {
      "content-type": {
        enum: ["application/json; charset=UTF-8", "application/json"],
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
  },
}
