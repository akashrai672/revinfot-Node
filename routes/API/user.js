const exppress = require("express");
const router = exppress.Router();
const userController = require("../../controllers/user");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
router.post(
  "/register",
  //   body("name").isEmpty().withMessage("Enter Name"),
  body("email").isEmail().withMessage("Enter Valid Email"),
  body("password")
    .isLength({ min: 8 }, { max: 15 })
    .withMessage("Password Must be 8 character long"),
  body("phone")
    .isLength({ min: 10 }, { max: 10 })
    .withMessage("Mobile No Must be of 10 digit"),
  userController.register
);
router.post("/login", userController.loginUser);
router.get("/list", userController.list);
router.post(
  "/detail",
  passport.authenticate("jwt", { session: false }),
  userController.userDetail
);
module.exports = router;
