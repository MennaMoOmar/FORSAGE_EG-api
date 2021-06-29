const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const User = require("../model/user");
const router = express.Router();
const { jwtSecret } = require("../config");

router.post(
  "/register",
  body("email").isEmail().withMessage("invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("password must be more than 5 characters"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, isAdmin, name } = req.body;

      // check if admin exists
      const isEmailTaken = await User.findOne({ email });
      if (isEmailTaken) {
        return res.status(400).json({ msg: " Admin already exists!!" });
      }

      // check if admin exists
      const isNameTaken = await User.findOne({ name });
      if (isNameTaken) {
        return res.status(400).json({ msg: " Admin already exists!!" });
      }

      // hash password
      const HashedPassword = await bcrypt.hash(password, 10);
      // register
      const user = await User.create({
        email,
        password: HashedPassword,
        isAdmin,
        name,
      });

      res.json(user);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
  }
);

router.post(
  "/login",
  body("name").exists().withMessage("name is required"),
  body("password").exists().withMessage("password is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, password } = req.body;

      // check if user does not exist
      const user = await User.findOne({ name });
      if (!user) {
        return res.status(400).json({ msg: "invalid email or password" });
      }

      // compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ msg: "invalid email or password" });
      }

      const token = await jwt.sign({ id: user.id }, jwtSecret);
      res.json({ token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server error");
    }
    console.log(req.body);
  }
);

module.exports = router;
