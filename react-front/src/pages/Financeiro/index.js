import React, { useState, useEffect } from "react";
import "./financeiro.css";
import api from "../../hooks/api";
import axios from 'axios';

const ControleEntradasSaidas = () => {
  const [movimentacao, setMovimentacao] = useState({
    tipo: "entrada",
    nome: "",
    descricao: "",
    valor: "",
  });

  const [historico, setHistorico] = useState([]);
  const [caixa, setCaixa] = useState({ saldo_total: 0, saldo_estimado: 0 });

  // Carrega histórico de movimentações
  const fetchHistorico = async () => {
    try {
      const res = await axios.get("http://localhost:8080/caixa/listarMovimentacoes");
      setHistorico(res.data);
    } catch (err) {
      console.error("Erro ao listar movimentações:", err);
    }
  };

  // Carrega saldo do caixa
  const fetchCaixa = async () => {
    try {
      const res = await axios.get("http://localhost:8080/caixa/obterCaixa");
      setCaixa(res.data);
    } catch (err) {
      console.error("Erro ao obter caixa:", err);
    }
  };

  useEffect(() => {
    fetchHistorico();
    fetchCaixa();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMovimentacao((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valorNumber = parseFloat(movimentacao.valor);
    if (isNaN(valorNumber) || valorNumber <= 0) {
      alert("Informe um valor válido maior que 0");
      return;
    }

    try {
      console.log("MOvimentacao", movimentacao)
      delete movimentacao.caixa
      await axios.post(
        "http://localhost:8080/caixa/cadastrarMovimentacao",
        { 
          ...movimentacao, valor: valorNumber
        },
        { headers: { "Content-Type": "application/json",  "Accept": "application/json" } }
      );

      alert("Movimentação cadastrada com sucesso!");
      setMovimentacao({ tipo: "entrada", nome: "", descricao: "", valor: "" });

      fetchHistorico();
      fetchCaixa();
    } catch (err) {
      console.error("Erro ao cadastrar movimentação:", err);
      alert("Erro ao cadastrar movimentação");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Deseja realmente deletar esta movimentação?")) return;

    try {
      await axios.delete(`http://localhost:8080/caixa/${id}/deletarMovimentacao`);
      fetchHistorico();
      fetchCaixa();
    } catch (err) {
      console.error("Erro ao deletar movimentação:", err);
      alert("Erro ao deletar movimentação");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Controle de Caixa</h1>
        <p>
          Saldo Total: R${caixa.saldo_total} | Saldo Estimado: R$
          {caixa.saldo_estimado}
        </p>
      </header>

      <main className="App-main">
        {/* Primeiro o histórico */}
        <div className="historico-container">
          <h2>Histórico de Movimentações</h2>
          <table className="historico-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {historico?.map((mov) => (
                <tr key={mov.id}>
                  <td>{mov.tipo}</td>
                  <td>{mov.nome}</td>
                  <td>{mov.descricao}</td>
                  <td>R${mov.valor}</td>
                  <td>{new Date(mov.data).toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(mov.id)}
                      className="btn-cadastrar"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
              {historico?.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    Nenhuma movimentação encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Depois o formulário */}
        <div className="cadastro-container">
          <form className="cadastro-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="tipo">Tipo:</label>
              <select
                id="tipo"
                name="tipo"
                value={movimentacao.tipo}
                onChange={handleChange}
              >
                <option value="entrada">Entrada</option>
                <option value="saida">Saída</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="nome">Nome:</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={movimentacao.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="descricao">Descrição:</label>
              <input
                type="text"
                id="descricao"
                name="descricao"
                value={movimentacao.descricao}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="valor">Valor:</label>
              <input
                type="number"
                id="valor"
                name="valor"
                value={movimentacao.valor}
                onChange={handleChange}
                required
                step="0.01"
              />
            </div>

            <button type="submit" className="btn-cadastrar">
              Registrar Movimentação
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ControleEntradasSaidas;
