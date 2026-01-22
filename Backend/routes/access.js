const express = require("express");
const router = express.Router();
const {
  createOrUpdateAccess,
  getAccessByRole
} = require("../controllers/accessController");

const { verifyToken } = require("../middleware/authMiddleware");

// Admin / Manager only (can restrict further)
router.post("/create", verifyToken, createOrUpdateAccess);
router.get("/get", verifyToken, getAccessByRole);

module.exports = router;
