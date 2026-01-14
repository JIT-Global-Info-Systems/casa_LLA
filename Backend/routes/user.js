const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create", userController.createUser);
router.put("/update/:user_id", authMiddleware.verifyToken, userController.updateUser);
router.get("/all", authMiddleware.verifyToken, userController.getAllUsers);
router.delete("/delete/:user_id", authMiddleware.verifyToken, userController.deleteUser);

module.exports = router;
