const User = require("../models/users");
const logger = require("../utils/logger");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      logger.warn(`[REGISTER] Gagal - Email sudah digunakan: ${email}`);
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    logger.info(`[REGISTER] Berhasil - User terdaftar: ${email}`);
    res.status(201).json({ msg: "User registered" });
  } catch (err) {
    logger.error(`[REGISTER ERROR] ${err.message}`);
    res.status(500).json({ msg: "Register failed", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`[LOGIN] Gagal - Email tidak ditemukan: ${email}`);
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`[LOGIN] Gagal - Password salah untuk: ${email}`);
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    logger.info(`[LOGIN] Berhasil - ${email} (ID: ${user._id})`);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    logger.error(`[LOGIN ERROR] ${err.message}`);
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
};
