const mongoose = require('mongoose')

mongoose.promise = global.promise

/** Set options To fix all deprecation warnings */
mongoose.connect(process.env.MONGODB_URI)

module.exports = { mongoose }