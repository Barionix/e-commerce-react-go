import React, { useEffect } from "react";
import api from "../../hooks/api";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [produtos, setProdutos] = React.useState([]);
  const navigate = useNavigate();

  const fetchProdutos = async () => {
    try {
      const response = await api.get("/api/v1/produtos/calcEstoque");
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src="logotransp.png" alt="Logo" />
          <h2>Admin</h2>
        </div>

        <nav className="menu">
          <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          <button onClick={() => navigate("/handle-products")}>
            Gerenciar Produtos
          </button>
          <button onClick={() => navigate("/cadastro-cupom")}>Cupons</button>
          <button onClick={() => navigate("/financeiro")}>Financeiro</button>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="main-content">
        <header className="App-header">
          <div className="titulo-container">
            <h1 className="titulo-completo">
              <span className="texto-titulo">Dashboard</span>
            </h1>
          </div>
        </header>

        <div className="dashboard-container">
          <h2 className="dashboard-subtitulo">Visão Geral</h2>

          <div className="dashboard-cards">
            <div className="card">
              <h3>Total de Produtos</h3>
              <p>{produtos.amount}</p>
            </div>

            <div className="card">
              <h3>Vendas Hoje</h3>
              <p>0</p>
            </div>

            <div className="card">
              <h3>Preço do Estoque</h3>
              <p>R$ {produtos.total}</p>
            </div>

            <div className="card">
              <h3>Preço Médio</h3>
              <p>R$ {produtos.average?.toFixed(2)}</p>
            </div>

            <div className="card">
              <h3>Itens no Estoque</h3>
              <p>{produtos.amountItens}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
