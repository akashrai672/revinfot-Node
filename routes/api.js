const express = require("express");
const UserRoutes = require("./API/user");
const ReferRoutes = require("./API/referAndEarn");
const HolidayRoutes = require("./API/holiday");
const router = express.Router();
router.use("/user", UserRoutes);
router.use("/refer", ReferRoutes);
router.use("/holiday", HolidayRoutes);
module.exports = router;
