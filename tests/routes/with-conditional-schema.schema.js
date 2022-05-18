export default {
  type: "object",
  properties: {
    headers: {
      type: "object",
      required: ["x-content-type"],
      properties: {
        "x-content-type": {
          enum: ["application/x-www-form-urlencoded"],
        },
        "x-api-version": { type: "string" },
      },
    },
  },
  if: {
    properties: {
      headers: {
        type: "object",
        properties: {
          "x-api-version": {
            type: "string",
            // <= 2.3.0
            pattern:
              "^([01]\\.(?:0|[1-9]\\d*)\\.(?:0|[1-9]\\d*)|2\\.[0-2]\\.(?:0|[1-9]\\d*)|2\\.3\\.0)$",
          },
        },
      },
    },
  },
  then: {
    properties: {
      body: {
        type: "object",
        // additionalProperties: false,
        properties: {
          foo: {
            type: "string",
          },
        },
      },
    },
  },
  else: {
    properties: {
      body: {
        type: "object",
        // additionalProperties: false,
        properties: {
          foo: {
            type: "number",
          },
        },
      },
    },
  },
}
