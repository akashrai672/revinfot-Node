const exppress = require("express");
const router = exppress.Router();
const holidayController = require("../../controllers/holiday");
router.post("/create", holidayController.register);
module.exports = router;
