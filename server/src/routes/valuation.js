const express    = require("express");
const controller = require("../controllers/valuationController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);
router.get("/",  controller.get);
router.post("/", controller.save);

module.exports = router;
