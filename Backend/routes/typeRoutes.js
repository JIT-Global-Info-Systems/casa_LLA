const express = require("express");
const router = express.Router();
const {
  createType,
  getAllTypes,
  updateType,
  deleteType
} = require("../controllers/typeController");

const{ verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, createType);
router.get("/", verifyToken, getAllTypes);
router.put("/:type_id", verifyToken, updateType);
router.delete("/:type_id", verifyToken, deleteType);

module.exports = router;


