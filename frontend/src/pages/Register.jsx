import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      navigate("/login"); // redireciona para o login
    } catch (err) {
      const msg = err.response?.data?.error || "Erro ao registar";
      setError(msg);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Registo</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: 300 }}>
        <input
          type="text"
          name="username"
          placeholder="Nome de utilizador"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Palavra-passe"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" style={{ marginTop: "1rem" }}>Registar</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
