const express    = require("express");
const controller = require("../controllers/businessProfileController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);
router.get("/",  controller.get);
router.post("/", controller.upsert);
router.put("/",  controller.upsert);

module.exports = router;
