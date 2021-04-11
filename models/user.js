const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const constants = require("../constants");
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "class",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.methods.hash = (password) => {
  return bcrypt.hashSync(password, constants.saltRounds);
};
const user = mongoose.model("users", UserSchema);
module.exports = user;
