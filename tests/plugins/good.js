module.exports = {
  depend: [],

  create: () => {
    return {
      getMessage: () => `Hello Plugin World!`,
    }
  },
}
