import React, { useState, useEffect } from "react";
import "./produtos.css";
import api from "../hooks/api";
import { IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import { useNavigate } from "react-router-dom";
import axios from 'axios';

const HandleProductFilter = () => {
  const [produtos, setProdutos] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [precoRange, setPrecoRange] = useState({
    min: 0,
    max: 0,
    atualMin: 0,
    atualMax: 0,
  });

  const navigate = useNavigate();

  const [products, setProduct] = useState(() => {
    return JSON.parse(localStorage.getItem("chart")) || [];
  });
  const [price, setPrice] = useState(0);

  const calcPrice = () => {
    let preco = 0;
    const chart = JSON.parse(localStorage.getItem("chart")) || [];
    chart.forEach((prod) => {
      preco += prod.preco * (prod.quantidade || 1);
    });
    localStorage.setItem("price", JSON.stringify(preco));
    setPrice(preco);
  };

  const removeItem = (prod) => {
    let chart = JSON.parse(localStorage.getItem("chart"));
    chart = chart.filter((produto) => produto.id !== prod.id);
    localStorage.setItem("chart", JSON.stringify(chart));
    calcPrice();
    setProduct(chart);
  };

  const productAction = (produto) => {
    navigate(`/editarProduto/${produto.id}`);
  };

  const finishPurchase = async () => {
    try {
      let preco = 0;
      JSON.parse(localStorage.getItem("chart")).map(
        (prod) => (preco += prod.preco)
      );

      const formData = new FormData();
      formData.append("chart", JSON.stringify(products));
      formData.append("preco", preco);

      const publish = await api.post("/sharts/publishChart", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Necessário para enviar arquivos
        },
      });

      const phone = "8498049717";
      const message = `Olá! Gostaria de concluir o meu pedido referente ao código ${publish.data}`;
      const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
        message
      )}`;

      localStorage.removeItem("chart");
      setProduct([]);
      window.open(url, "_blank");
      alert("Carrinho publicado");
    } catch (error) {
      alert("Erro ao finalizar compra!");
    }
  };

  const fetchProdutos = async () => {
    try {
      const response = await axios.get("http://localhost:8080/produtos/listarProdutos");
      setProdutos(response.data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  useEffect(() => {
    const chart = JSON.parse(localStorage.getItem("chart")) || [];
    setProduct(chart);
  }, []);

  useEffect(() => {
    if (produtos.length > 0) {
      const maxPreco = Math.max(...produtos.map((p) => p.preco));
      setPrecoRange((prev) => ({
        ...prev,
        max: maxPreco,
        atualMax: maxPreco,
      }));
    }
  }, [produtos]);

  const categorias = ["todos", ...new Set(produtos.map((p) => p.categoria))];

  const produtosFiltrados = produtos.filter((produto) => {
    const categoriaMatch =
      filtroCategoria === "todos" || produto.categoria === filtroCategoria;

    const precoMatch =
      produto.preco >= precoRange.atualMin &&
      produto.preco <= precoRange.atualMax;

    // ✅ Corrigido: só mostra produtos com visivel = true ou null
    const visivelMatch = produto.visivel === true || produto.visivel === null;

    return categoriaMatch && precoMatch && visivelMatch;
  });

  const updateQuantity = (id, change) => {
    let chart = JSON.parse(localStorage.getItem("chart")) || [];

    chart = chart.map((prod) => {
      if (prod.id === id) {
        const novaQtd = (prod.quantidade || 1) + change;
        return { ...prod, quantidade: novaQtd > 0 ? novaQtd : 1 };
      }
      return prod;
    });

    localStorage.setItem("chart", JSON.stringify(chart));
    setProduct(chart);
    calcPrice();
  };

  const toggleCart = () => {
    calcPrice();
    setShowCart(!showCart);
  };

  const handlePrecoChange = (e) => {
    const { name, value } = e.target;
    const novoValor = parseFloat(value);

    if (name === "atualMin" && novoValor > precoRange.atualMax) {
      return;
    }
    if (name === "atualMax" && novoValor < precoRange.atualMin) {
      return;
    }

    setPrecoRange((prev) => ({
      ...prev,
      [name]: novoValor,
    }));
  };

  return (
    <div className="catalogo-container">
      {/* Sidebar de filtros */}
      <div className="sidebar-filtros">
        <h3>Filtrar por categoria:</h3>
        <div className="categorias-buttons">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setFiltroCategoria(categoria)}
              className={`categoria-btn ${
                filtroCategoria === categoria ? "active" : ""
              }`}
            >
              {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
            </button>
          ))}
        </div>

        {/* Filtro de Preço */}
        <div className="filtro-section">
          <h3>Faixa de Preço</h3>
          <div className="preco-range-container">
            <div className="preco-labels">
              <span>R$ {precoRange.atualMin.toFixed(2)}</span>
              <span>R$ {precoRange.atualMax.toFixed(2)}</span>
            </div>
            <label htmlFor="precoMin">Preço Min</label>
            <input
              type="range"
              min={0}
              max={precoRange.max}
              value={precoRange.atualMin}
              name="atualMin"
              onChange={handlePrecoChange}
              className="range-slider"
            />
            <label htmlFor="precoMax">Preço Max</label>
            <input
              type="range"
              min={0}
              max={precoRange.max}
              value={precoRange.atualMax}
              name="atualMax"
              onChange={handlePrecoChange}
              className="range-slider"
            />
            {/* Botão flutuante de carrinho */}
            <div className="shopping-cart">
              <IconButton
                className="cart-button"
                aria-label="Carrinho de compras"
                onClick={() => toggleCart()}
                style={{ fontSize: 28, marginLeft: "40%" }}
              >
                <ShoppingCartIcon style={{ fontSize: 28, color: "#0C4B33" }} />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      {/* Área de produtos */}
      <div className="produtos-area">
        <div className="produtos-grid-fixed">
          {produtosFiltrados.map((produto) => (
            <div key={produto.id} className="produto-card">
              <div className="produto-imagem-container">
                <img
                   src={produto.img}
                  alt={produto.nome}
                  className="produto-imagem"
                />
                {produto.estoque <= 0 && (
                  <div className="sem-estoque-badge">SEM ESTOQUE</div>
                )}
              </div>
              <div className="produto-info">
                <h3 onClick={() => navigate(`/produto/${produto.id}`)}>
                  {produto.nome}
                </h3>
                <div
                  className="produto-estoque"
                  onClick={() => navigate(`/produto/${produto.id}`)}
                >
                  {produto.estoque > 0 ? (
                    produto.reserva === true ? (
                      <span>
                        Produtos a caminho: {produto.estoque} unidades
                      </span>
                    ) : (
                      <span>Em estoque: {produto.estoque} unidades</span>
                    )
                  ) : (
                    <span className="estoque-esgotado">Produto esgotado</span>
                  )}
                </div>

                {/* ✅ Preço com desconto aplicado */}
                <p className="produto-preco">
                  {produto.precoComDesconto &&
                  produto.precoComDesconto < produto.preco ? (
                    <>
                      {/* Preço original riscado (em cima, menor) */}
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.9em",
                          color: "#888",
                          textDecoration: "line-through",
                        }}
                      >
                        {produto.preco.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>

                      {/* Preço com desconto (em baixo, maior e verde) */}
                      <span
                        style={{
                          display: "block",
                          fontSize: "1.2em",
                          fontWeight: "bold",
                          color: "#0C4B33",
                          marginTop: "2px",
                        }}
                      >
                        {produto.precoComDesconto.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </>
                  ) : (
                    // Caso não tenha desconto, mostra só o preço normal
                    <span
                      style={{
                        display: "block",
                        fontSize: "1.1em",
                        fontWeight: "bold",
                        color: "#000",
                      }}
                    >
                      {produto.preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  )}
                </p>

                <button
                  className={`btn-comprar ${
                    produto.estoque <= 0 ? "disabled" : ""
                  }`}
                  onClick={(e) => productAction(produto)}
                >
                  Editar Produto
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HandleProductFilter;
