module.exports = {
  headers: {
    type: "object",
    required: ["x-content-type"],
    properties: {
      "x-content-type": {
        enum: [
          "application/json",
          "application/x-www-form-urlencoded",
          "multipart/form-data",
        ],
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
