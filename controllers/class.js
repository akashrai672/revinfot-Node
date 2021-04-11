const { validationResult } = require("express-validator");
const classModel = require("../models/class");
const SendResponse = require("../apiHandler");
module.exports = {
  register: async (req, res) => {
    try {
      let existClassName = await classModel.findOne({
        name: { $regex: `^${req.body.name}$`, $options: "-i" },
      });
      if (existClassName) {
        SendResponse(res, {}, "Class Name Already taken", 409);
      }
      let classes = new classModel(req.body);
      classes = await classes.save();
      return SendResponse(res, classes, "Data Saved", 200);
    } catch (err) {
      console.log(err);
      SendResponse(res, {}, "Internal Server Error", 500);
    }
  },
  list: async (req, res) => {
    try {
      let existClass = await classModel.find({});
      SendResponse(res, existClass, "Class List", 200);
    } catch (err) {
      console.log(err);
      SendResponse(res, {}, "Internal Server Error", 500);
    }
  },
};
