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
      const { email, password, isAdmin } = req.body;

      // check if admin exists
      const isTaken = await User.findOne({ email });
      if (isTaken) {
        return res.status(400).json({ msg: " Admin already exists!!" });
      }

      // hash password
      const HashedPassword = await bcrypt.hash(password, 10);
      // register
      const user = await User.create({
        email,
        password: HashedPassword,
        isAdmin,
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
  body("email").isEmail().withMessage("invalid email"),
  body("password").exists().withMessage("password is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      // check if user does not exist
      const user = await User.findOne({ email });
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
