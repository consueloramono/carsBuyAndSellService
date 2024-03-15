const express = require("express");
const registerRouter = require("../controllers/userRegisterController");

const router = express.Router();

router.post("/register", registerRouter);

module.exports = router;
