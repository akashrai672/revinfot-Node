const express = require("express");
const UserRoutes = require("./API/user");
const classRoutes = require("./API/class");
const router = express.Router();
router.use("/user", UserRoutes);
router.use("/class", classRoutes);
module.exports = router;
