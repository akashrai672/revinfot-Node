const { validationResult } = require("express-validator");
const holidaysModel = require("../models/holidays");
const SendResponse = require("../apiHandler");
module.exports = {
  register: async (req, res) => {
    try {
      let existHoliday = await holidaysModel.findOne({
        name: { $regex: `^${req.body.name}$`, $options: "-i" },
        date: req.body.date,
      });
      if (existHoliday) {
        SendResponse(res, {}, "Holiday Already Inserted.", 400);
      }
      let holiday = new holidaysModel(req.body);
      holiday = await holiday.save();
      return SendResponse(res, holiday, "Data Saved", 200);
    } catch (err) {
      console.log(err);
      SendResponse(res, {}, "Internal Server Error", 500);
    }
  },
};
