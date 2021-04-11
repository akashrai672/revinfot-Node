const mongoose = require("mongoose");
const { Schema } = mongoose;
const holidaysSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});
const user = mongoose.model("holidays", holidaysSchema);
module.exports = user;
