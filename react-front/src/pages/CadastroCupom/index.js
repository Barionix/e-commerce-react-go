import React, { useState, useEffect } from "react";
import "./cadastro.css";
import api from "../../hooks/api";
import axios from "axios";

const CadastroCupom = () => {
  const [cupom, setCupom] = useState({
    code: "",
    autor: "",
    desconto: "",
  });

  const [cupons, setCupons] = useState([]);

  // Busca cupons ao carregar o componente
  const fetchCupons = async () => {
    try {
      const res = await axios.get("http://localhost:8080/cupons/listarCupons"); // endpoint para listar cupons
      setCupons(res.data);
    } catch (err) {
      console.error("Erro ao listar cupons:", err);
    }
  };

  useEffect(() => {
    fetchCupons();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCupom((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8080/cupons/cadastrarCupom",
         { code: cupom.code, autor: cupom.autor, desconto: cupom.desconto },
        { headers: { "Content-Type": "application/json" } }
      );
      alert("Cupom cadastrado com sucesso!");
      setCupom({ code: "", autor: "", desconto: "" });
      fetchCupons();
    } catch (err) {
      console.error("Erro ao cadastrar cupom:", err);
      alert("Erro ao cadastrar o cupom");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="titulo-container">
          <h1 className="titulo-completo">
            <span className="texto-titulo">Cadastro de Cupom</span>
            <img
              src="logotransp.png"
              alt="Ícone de estrela prateada decorativa"
              className="icone-alinhado"
            />
          </h1>
        </div>
      </header>
      <main className="App-main">
        {/* Lista de cupons em formato de ticket */}
        <div className="cupons-container">
          {cupons?.length === 0 && <p>Nenhum cupom cadastrado</p>}
          {cupons?.map((c) => (
            <div key={c.id} className="ticket">
              <div className="ticket-code">{c.code}</div>
              <div className="ticket-info">
                <span>Autor: {c.autor || "-"}</span>
                <span>Desconto: {c.desconto}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Formulário de cadastro */}
        <div className="cadastro-container">
          <form className="cadastro-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="code">Código:</label>
              <input
                type="text"
                id="code"
                name="code"
                value={cupom.code}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="autor">Autor:</label>
              <input
                type="text"
                id="autor"
                name="autor"
                value={cupom.autor}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="desconto">Desconto(%):</label>
              <input
                type="number"
                id="desconto"
                name="desconto"
                value={cupom.desconto}
                onChange={handleChange}
                required
                step="0.01"
              />
            </div>

            <button type="submit" className="btn-cadastrar">
              Cadastrar Cupom
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CadastroCupom;
