const express = require("express");
const UserController = require("./controllers/userController");
const profileController = require("./controllers/profileController");
const router = express.Router();

router.post("/registration", UserController.registration);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/refresh", UserController.refresh);
router.post("/createProfile", profileController.createProfile);
router.put("/editProfile", profileController.updateProfile);

module.exports = router;
