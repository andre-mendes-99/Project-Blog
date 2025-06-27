const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email já em uso." });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "Usuário registado com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro no registo." });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Usuário não encontrado." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: "Senha incorreta." });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "2h"
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Erro no login." });
  }
});

module.exports = router;
