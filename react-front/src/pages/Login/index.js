import React, { useState } from "react";
import "./login.css";
import api from "../../hooks/api";
import axios from 'axios';

const Login = () => {
  const [usuario, setUsuario] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario.email || !usuario.password) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      console.log("Enviando dados de login:", usuario);
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        { email: usuario.email, password: usuario.password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // supondo que o backend devolva token e dados do usuário
      localStorage.setItem("user", JSON.stringify(response.data.user));

      localStorage.setItem("token", response.data.token);
      alert("Login realizado com sucesso!");
      // redireciona para dashboard ou home
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Erro no login:", err);
      alert("Credenciais inválidas ou erro no servidor!");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="titulo-container">
          <h1 className="titulo-completo">
            <span className="texto-titulo">Catálogo - Admin</span>
            <img
              src="logotransp.png"
              alt="Ícone decorativo"
              className="icone-alinhado"
            />
          </h1>
        </div>
      </header>

      <main className="App-main">
        <div className="login-container">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={usuario.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Senha:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={usuario.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-login">
              Entrar
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
