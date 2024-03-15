const { User, validate } = require("../models/userSchema");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const registerRouter = router.post("/register", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).send("User already exisits. Please sign in"); // Перевірка унікальності email
  } else {
    const { error } = validate(req.body); // Валідація даних (min, max)
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password,
      });
      await user.save();
      return res.status(201).json(user);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
});

module.exports = registerRouter;
