const { validationResult } = require("express-validator");
const couponModel = require("../models/referAndEarn");
const SendResponse = require("../apiHandler");
const UserService = require("../services/user-services");
module.exports = {
  register: async (req, res) => {
    try {
      let authData = await UserService.Auth(req);
      let existCoupon = await couponModel.findOne({ createdBy: authData.id });
      if (existCoupon) {
        SendResponse(
          res,
          `your coupon Code is ${existCoupon.referalCode}`,
          "Coupon",
          200
        );
      }
      req.body.referalCode = Date.now();
      req.body.createdBy = authData.id;
      let refer = new couponModel(req.body);
      refer = await refer.save();
      return SendResponse(res, refer, "Data Saved", 200);
    } catch (err) {
      console.log(err);
      SendResponse(res, {}, "Internal Server Error", 500);
    }
  },
};
