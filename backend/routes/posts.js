const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const authMiddleware = require("../middleware/auth");


// Rota para apagar post (autorizada)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post não encontrado" });
    }

    // Verifica se o utilizador é o autor OU é admin
    if (post.authorId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Sem permissão para apagar este post" });
    }

    await post.deleteOne();

    res.json({ message: "Post apagado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao apagar post" });
  }
});

// Criar novo post (protegido)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, body } = req.body;
    const authorId = req.user.id;

    const post = new Post({ title, body, authorId });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar post" });
  }
});

// Listar posts (público)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("authorId", "username email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
});

module.exports = router;
