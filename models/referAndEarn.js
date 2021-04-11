const mongoose = require("mongoose");
const { Schema } = mongoose;
const couponSchema = new Schema({
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  referalCode: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: Array,
    default: [],
  },
});
const user = mongoose.model("coupons", couponSchema);
module.exports = user;
