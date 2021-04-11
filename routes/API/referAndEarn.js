const exppress = require("express");
const router = exppress.Router();
const referAndEarnController = require("../../controllers/referAndEarn");
router.post("/create", referAndEarnController.register);
module.exports = router;
