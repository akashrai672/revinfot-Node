const { validationResult } = require("express-validator");
const userModel = require("../models/user");
const SendResponse = require("../apiHandler");
const constants = require("../constants");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
module.exports = {
  register: async (req, res) => {
    try {
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        return SendResponse(res, { errors: errors.array() }, "error", 400);
      }
      let user = new userModel(req.body);
      user.password = user.hash(req.body.password);
      user = await user.save();
      return SendResponse(res, user, "Data Saved", 200);
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
              { user: user, token: authToken },
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
};
function sendNotification(token) {}
