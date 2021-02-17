const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const owner = require("../middleware/owner");

const stuffCtrl = require("../controllers/sauce");

router.get("/", auth, stuffCtrl.getAllSauce);
router.post("/", auth, multer, stuffCtrl.createSauce);
router.post("/:id/like", auth, stuffCtrl.likeSauce);
router.get("/:id", auth, stuffCtrl.getOneSauce);
router.put("/:id", owner, auth, multer, stuffCtrl.modifySauce);
router.delete("/:id", auth, stuffCtrl.deleteSauce);

module.exports = router;
