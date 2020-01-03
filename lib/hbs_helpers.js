module.exports = {
  ifEqual: function (arg1, arg2, options) {
    return (arg1 === arg2) ? options.fn(this) : options.inverse(this)
  },

  addDot: function (arg1) {
    return arg1 && arg1.toLocaleString()
  }
}