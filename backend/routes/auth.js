const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const auth = require("../middleware/authMiddleware");

// ✅ Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    // check duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ msg: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashed });
    await user.save();

    return res.status(201).json({ message: "User registered ✅" });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ msg: err.message || "Server error" });
  }
});

// ✅ Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Wrong password" });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ msg: "JWT_SECRET missing in .env" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({ token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ msg: err.message || "Server error" });
  }
});

// ✅ Me (Protected)
router.get("/me", auth, async (req, res) => {
  try {
    return res.json({ message: "You are authorized ✅", user: req.user });
  } catch (err) {
    console.error("ME ERROR:", err);
    return res.status(500).json({ msg: err.message || "Server error" });
  }
});

module.exports = router;