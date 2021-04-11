const { validationResult } = require("express-validator");
const userModel = require("../models/user");
const CouponModel = require("../models/referAndEarn");
const HolidayModel = require("../models/holidays");
const SendResponse = require("../apiHandler");
const constants = require("../constants");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
module.exports = {
  register: async (req, res) => {
    try {
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        return SendResponse(res, { errors: errors.array() }, "error", 400);
      }
      if (
        req.body.couponId != undefined &&
        req.body.couponId != null &&
        req.body.couponId != ""
      ) {
        let existCode = await CouponModel.findOne({
          referalCode: req.body.couponId,
        });
        if (!existCode) {
          return SendResponse(res, {}, "Invalid Coupon Code", 400);
        } else {
          let mutiplier = 1;
          let mDate = moment().format("YYYY-MM-DD");
          let nextDate = moment(mDate).add(1, "days");
          console.log(new Date(moment().format()));
          let existHoliday = await HolidayModel.findOne({
            date: {
              $gte: new Date(mDate),
              $lt: new Date(nextDate),
            },
          });
          if (existHoliday) mutiplier = 2;
          console.log("existHoliday", existHoliday);
          let currentDate = new Date();
          let currentDayNo = currentDate.getDay();
          console.log(currentDayNo);
          if (currentDayNo >= 1 && currentDayNo <= 5) {
            if (existCode.assignedTo.length < 4) {
              req.body.point = 20 * mutiplier;
            } else {
              req.body.point = 10 * mutiplier;
            }
          } else {
            if (existCode.assignedTo.length < 3) {
              req.body.point = 40 * mutiplier;
            } else {
              req.body.point = 20 * mutiplier;
            }
          }
          req.body.couponId = existCode._id;
          let user = new userModel(req.body);
          user.password = user.hash(req.body.password);
          user = await user.save();
          await CouponModel.findOneAndUpdate(
            { _id: existCode._id },
            { $push: { assignedTo: user._id } },
            { new: true }
          );
          return SendResponse(res, user, "Data Saved", 200);
        }
      } else {
        let user = new userModel(req.body);
        user.password = user.hash(req.body.password);
        user = await user.save();
        return SendResponse(res, user, "Data Saved", 200);
      }
    } catch (err) {
      console.log(err);
      SendResponse(res, {}, "Internal Server Error", 500);
    }
  },
  loginUser: async (req, res) => {
    await userModel
      .findOne({
        email: req.body.email,
      })
      .select("+password")
      .lean()
      .exec()
      .then(async (user) => {
        if (user) {
          let isPwd = await bcrypt.compare(req.body.password, user.password);
          if (isPwd) {
            let authToken = jwt.sign(
              {
                data: {
                  id: user._id,
                  email: user.email,
                },
              },
              `${constants.jwtSecret}`,
              { expiresIn: "7h" }
            );
            delete user.password;
            return SendResponse(
              res,
              { user: user, token: `Bearer ${authToken}` },
              "Admin successfully logged In",
              200
            );
          } else {
            return SendResponse(res, {}, "InValid Password", 400);
          }
        } else {
          SendResponse(res, {}, "Invalid Email.", 400);
        } /// user else block
      })
      .catch((err) => {
        console.log(err);
        return SendResponse(res, {}, "Internal Server Error", 500);
      });
  },
  callBackExample: async (req, res) => {
    try {
      console.log("FirstLog");
      setTimeout(() => {
        console.log("Set Time OutCallBack");
      }, 0);
      console.log("ThirdLog");
      console.log("FourthLog");
      SendResponse(res, {}, "See Log For Call Back Example", 200);
    } catch (err) {
      console.log(err);
      SendResponse(res, {}, "Internal Server Error", 500);
    }
  },
  printPattern: async (req, res) => {
    try {
      let arr = [];
      for (let index = 1; index <= Number(req.body.noOfTerm); index++) {
        if (index == 1) {
          arr.push(index);
        } else {
          console.log(arr.length);
          arr.push(arr[arr.length - 1] + index);
        }
      }
      SendResponse(res, arr, "Pattern", 200);
    } catch (err) {
      console.log(err);
      SendResponse(res, {}, "Internal Server Error", 500);
    }
  },
  userDetail: async (req, res) => {
    try {
      let user = await userModel
        .findOne({ _id: req.body.userId })
        .populate("classId");
      if (user) {
        SendResponse(res, user, "Detail Of User", 200);
      } else {
        SendResponse(res, {}, "Invalid UserId", 400);
      }
    } catch (err) {
      console.log(err);
      SendResponse(res, {}, "Internal Server Error", 500);
    }
  },
  SendNotification: async (req, res) => {
    try {
      // Send FCM notification to more than 1000 tokens node js
      let userDeviceToken = [];
      for (let i = 0; i < userDeviceToken.length; i += 1000) {
        const token = userDeviceToken.slice(i, i + 1000);
        await sendNotification(token);
      }
      SendResponse(res, {}, "Notification Send Please Check Code", 200);
    } catch (err) {
      console.log(err);
      SendResponse(res, {}, "Internal Server Error", 500);
    }
  },
  list: async (req, res) => {
    try {
      let {
        page,
        limit,
        sort,
        order,
        search,
        to_date,
        from_date,
        loginAs,
      } = req.query;
      let skip = page * limit - limit || 0;
      limit = parseInt(limit) || 10;
      order = order == "desc" ? -1 : 1;
      sort = {
        [sort || "createdAt"]: order,
      };
      let params = {};
      if (
        from_date != null &&
        to_date != null &&
        from_date != "" &&
        to_date != ""
      ) {
        params = Object.assign(params, {
          createdAt: {
            $gte: new Date(from_date),
            $lt: new Date(to_date),
          },
        });
      }
      if (loginAs != undefined && loginAs != "" && loginAs != null)
        params = Object.assign(params, { loginAs: loginAs });
      if (search != null && search != undefined && search != "") {
        params = Object.assign(params, {
          $or: [{ name: { $regex: ".*" + search + ".*", $options: "i" } }],
        });
      }
      console.log(params);
      let allUser = await userModel
        .aggregate([
          {
            $match: params,
          },
          { $sort: sort },
          { $skip: skip },
          { $limit: limit },
        ])
        .exec();
      let totalUser = await userModel.countDocuments(params);
      return SendResponse(
        res,
        { allUser, total: totalUser },
        "Records Fetched",
        200
      );
    } catch (error) {
      console.log(error);
      return SendResponse(res, {}, "Internal Server Error", 500);
    }
  },
};
