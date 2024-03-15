const express = require("express");
const UserController = require("./controllers/userController");
const authMiddleware = require("./middlewares/authMiddleware");
const router = express.Router();

router.post("/registration", UserController.registration);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/refresh", UserController.refresh);
router.get("/users", authMiddleware, UserController.users);

module.exports = router;
