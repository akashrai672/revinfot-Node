const mongoose = require("mongoose");
const { Schema } = mongoose;
const classSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
});
const user = mongoose.model("class", classSchema);
module.exports = user;
