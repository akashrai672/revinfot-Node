const exppress = require("express");
const router = exppress.Router();
const classController = require("../../controllers/class");
router.post("/register", classController.register);
router.get("/list", classController.list);
module.exports = router;
