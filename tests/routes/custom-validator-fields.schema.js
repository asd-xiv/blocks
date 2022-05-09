export default {
  headers: {
    type: "object",
    required: ["x-content-type"],
    properties: {
      "x-content-type": {
        enum: ["application/json"],
      },
    },
  },

  params: {
    type: "object",
    additionalProperties: false,
    properties: {
      id: {
        type: "string",
        format: "uuid",
      },
    },
  },

  query: {
    type: "object",
    additionalProperties: false,
    properties: {
      email: {
        type: "string",
        format: "email",
      },
    },
  },

  body: {
    type: "object",
    additionalProperties: false,
    properties: {
      thumbnailURL: {
        type: "string",
        format: "uri",
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
    },
  },
}
