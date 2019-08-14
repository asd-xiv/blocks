/**
 * foo: {
 *   type: "string",
 *   pattern: "^[a-z0-9-]+$",
 *   maxLength: 25,
 *   minLength: 25,
 * },
 *
 * limit: {
 *   type: "integer",
 *   minimum: 1,
 *   maximum: 100,
 *   default: 20,
 * },
 *
 * bar: {
 *   type: "string",
 *   enum: ["lorem", "dolor", "bobby"],
 * },
 *
 * ipsum: {
 *   type: ["integer", "null"],
 *   enum: ["lorem", "dolor", "bobby"],
 * },
 *
 * id: {
 *   oneOf: [
 *     { type: "integer" },
 *     {
 *       type: "array",
 *       items: { type: "integer" },
 *       minItems: 1,
 *       uniqueItems: true,
 *     },
 *   ],
 * },
 */

module.exports = {
  params: {
    type: "object",
    additionalProperties: false,
    properties: {
      name: {
        type: "string",
      },
    },
  },
}
