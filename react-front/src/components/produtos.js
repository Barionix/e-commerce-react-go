import React, { useState, useEffect } from "react";
import "./produtos.css";
import api from "../hooks/api";
import { IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

const ProdutosComFiltro = () => {
  const [produtos, setProdutos] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState("todos");
  const [precoRange, setPrecoRange] = useState({
    min: 0,
    max: 0,
    atualMin: 0,
    atualMax: 0,
  });
  const [products, setProduct] = useState(
    () => JSON.parse(localStorage.getItem("chart")) || []
  );
  const [price, setPrice] = useState(0);
  const [cupom, setCupom] = useState("");
  const [nome, setNome] = useState("");

  const navigate = useNavigate();

  const calcPrice = async (cpm) => {
    let preco = 0;
    const chart = JSON.parse(localStorage.getItem("chart")) || [];
    chart.forEach((prod) => {
      console.log(preco);
      preco +=
        (prod.precoComDesconto > 0 ? prod.precoComDesconto : prod.preco) *
        (prod.quantidade || 1);
    });
    if (cpm) {
      let cupom = await api.get(`/caixa/validarCupom?codigo=${cpm}`);
      console.log("CUPOM", cupom);
      if (cupom.data.desconto > 0 && cupom.data.desconto < 100) {
        console.log("CUPOM", cupom);
        const desconto = (preco * cupom.data.desconto) / 100;
        preco = preco - desconto;
        alert(
          `Cupom aplicado! Você recebeu um desconto de ${cupom.data.desconto}%.`
        );
      }
    }

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

  const getAction = (produto) => {
    let nChart = [];
    setShowCart(true);
    if (produto.reserva === true) {
      window.open("https://api.whatsapp.com/send?phone=8499049717", "_blank");
    } else {
      let chart = JSON.parse(localStorage.getItem("chart")) || [];
      if (chart.filter((prod) => prod.id === produto.id).length === 0) {
        chart.push(produto);
        localStorage.setItem("chart", JSON.stringify(chart));
        calcPrice();
        setProduct(chart);
      }
    }
  };

  const finishPurchase = async (tipo, cupom) => {
    try {
      let preco = 0;
      JSON.parse(localStorage.getItem("chart")).map(
        (prod) => (preco += prod.preco * (prod.quantidade || 1))
      );

      const formData = new FormData();
      formData.append("chart", JSON.stringify(products));
      formData.append("preco", preco);

      if (nome) formData.append("nome", nome);
      if (cupom) formData.append("cupom", cupom);

      const publish = await axios.post("http://localhost:8080/sharts/publishChart", formData, {
        headers: { "Content-Type": "application/json" },
      });

      const phone = "8498049717";
      const message = `Olá! Gostaria de concluir o meu pedido referente ao código ${publish.data.code}`;
      const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
        message
      )}`;

      localStorage.removeItem("chart");
      setProduct([]);
      setCupom("");
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
    setProduct(JSON.parse(localStorage.getItem("chart")) || []);
  }, []);
  useEffect(() => {
    if (produtos.length > 0) {
      const maxPreco = Math.max(...produtos.map((p) => p.preco));
      setPrecoRange((prev) => ({ ...prev, max: maxPreco, atualMax: maxPreco }));
    }
  }, [produtos]);

  const categorias = ["todos", ...new Set(produtos.map((p) => p.categoria))];
  const produtosFiltrados = produtos.filter((produto) => {
    const categoriaMatch =
      filtroCategoria === "todos" || produto.categoria === filtroCategoria;
    const precoMatch =
      produto.preco >= precoRange.atualMin &&
      produto.preco <= precoRange.atualMax;
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
    if (name === "atualMin" && novoValor > precoRange.atualMax) return;
    if (name === "atualMax" && novoValor < precoRange.atualMin) return;
    setPrecoRange((prev) => ({ ...prev, [name]: novoValor }));
  };

  const handleCupomChange = (e) => {
    setCupom(e.target.value);
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
            <div className="shopping-cart">
              <IconButton
                className="cart-button"
                aria-label="Carrinho de compras"
                onClick={toggleCart}
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
                <p className="produto-preco">
                  {produto.precoComDesconto &&
                  produto.precoComDesconto < produto.preco ? (
                    <>
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
                  disabled={produto.estoque <= 0}
                  onClick={() => getAction(produto)}
                >
                  {produto.estoque > 0
                    ? produto.reserva === true
                      ? "Reservar"
                      : "Adicionar ao Carrinho"
                    : "Indisponível"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Card do carrinho */}
      {showCart && (
        <Card
          key={products.length}
          sx={{
            position: "fixed",
            top: "80px",
            right: "20px",
            width: "250px",
            boxShadow: "0 4px 12px red",
            borderRadius: "16px",
            zIndex: 1000,
            backgroundColor: "#fff",
            color: "black",
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ textAlign: "center" }}>
              Carrinho
            </Typography>

            {products?.map((produto, index) => (
              <Box
                key={index}
                sx={{
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "8px",
                  marginBottom: "8px",
                }}
              >
                <Typography variant="body2">Nome: {produto.nome}</Typography>
                <Typography variant="body2">
                  Preço: R${" "}
                  {(produto.preco * (produto.quantidade || 1)).toFixed(2)}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    mt: 1,
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => updateQuantity(produto.id, -1)}
                    disabled={(produto.quantidade || 1) <= 1}
                    sx={{
                      minWidth: "32px",
                      padding: "2px 0",
                      borderWidth: "2px",
                      borderColor: "#555",
                      fontWeight: "bold",
                    }}
                  >
                    -
                  </Button>
                  <Typography sx={{ minWidth: "20px", textAlign: "center" }}>
                    {produto.quantidade || 1}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => updateQuantity(produto.id, 1)}
                    sx={{
                      minWidth: "32px",
                      padding: "2px 0",
                      borderWidth: "2px",
                      borderColor: "#555",
                      fontWeight: "bold",
                    }}
                  >
                    +
                  </Button>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => removeItem(produto)}
                  sx={{
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    fontWeight: "bold",
                    marginTop: "8px",
                    "&:hover": { backgroundColor: "#d9363e" },
                  }}
                >
                  Remover
                </Button>
              </Box>
            ))}

            <Typography variant="body2">
              <b>Total:</b> {price} R$
            </Typography>
            <Typography variant="body2">
              <b>Itens:</b> {products.length} itens
            </Typography>

            <Box
              sx={{ display: "flex", flexDirection: "column", mt: 1, mb: 2 }}
            >
              <label htmlFor="cupom">Nome do Comprador:</label>
              <input
                type="text"
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o seu nome"
                style={{
                  padding: "6px 8px",
                  marginBottom: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  marginTop: "4px",
                }}
              />
            </Box>
            {/* Input de Cupom */}
            <Box
              sx={{ display: "flex", flexDirection: "column", mt: 1, mb: 1 }}
            >
              <label htmlFor="cupom">Código do Cupom:</label>
              <input
                type="text"
                id="cupom"
                value={cupom}
                onChange={handleCupomChange}
                placeholder="Digite o código do cupom"
                style={{
                  padding: "6px 8px",
                  marginBottom: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  fontSize: "14px",
                  marginTop: "4px",
                }}
              />
              <button
                className={`btn-comprar`}
                sx={{ marginTop: "10px" }}
                onClick={() => calcPrice(cupom)}
              >
                Aplicar
              </button>
            </Box>

            <button
              className={`btn-comprar`}
              onClick={() => finishPurchase("produto", cupom)}
            >
              Finalizar Compra
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProdutosComFiltro;
