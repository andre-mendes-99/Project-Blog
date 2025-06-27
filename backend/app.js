const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB conectado!"))
    .catch(err => console.error("Erro de conexão:", err));

// Exemplo de rota
app.get("/", (req, res) => {
    res.send("API Blog está funcionando!");
});

// Start servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

const postsRouter = require("./routes/posts");
app.use("/api/posts", postsRouter);
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
