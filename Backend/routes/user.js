const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/create",authMiddleware.verifyToken, userController.createUser);
router.put("/update/:user_id", authMiddleware.verifyToken, userController.updateUser);
router.get("/all", authMiddleware.verifyToken, userController.getAllUsers);
router.delete("/delete/:user_id", authMiddleware.verifyToken, userController.deleteUser);
router.get("/:id",authMiddleware.verifyToken, userController.getUserById)

module.exports = router;
