export default {
  name: "ErrorPlugin",

  depend: [],

  create: () => {
    return {
      error: (/* error, payload */) => {},
    }
  },
}
