import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import Slider from "react-slick";
import { useParams } from "react-router-dom";
import api from "../hooks/api";

const ProdutoCard = () => {
  const { productId } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProduct] = useState(() => {
    return JSON.parse(localStorage.getItem("chart")) || [];
  });
  const [price, setPrice] = useState(0);
  const calcPrice = () => {
    let preco = 0;
    JSON.parse(localStorage.getItem("chart")).map(
      (prod) => (preco += prod.preco)
    );
    localStorage.setItem("price", JSON.stringify(preco));
    setPrice(preco);
  };

  const getAction = (produto) => {
    let nChart = [];
    if (produto.reserva === true) {
      window.open("https://api.whatsapp.com/send?phone=8499049717", "_blank");
    } else {
      let chart = JSON.parse(localStorage.getItem("chart"));

      if (chart === null) {
        nChart.push(produto);
        localStorage.setItem("chart", JSON.stringify(nChart));
        calcPrice();
        alert("Produto adicionado ao carrinho!");
        setProduct(nChart);
      } else {
        if (chart.filter((prod) => prod.id === produto.id).length === 0) {
          chart.push(produto);
          localStorage.setItem("chart", JSON.stringify(chart));
          alert("Produto adicionado ao carrinho!");
          setProduct(chart);
        }
      }
    }
  };

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await api.get(`/produtos/${productId}/getProductByID/`);
        setProduto(response.data);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [productId]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  if (!produto) {
    return <Typography>Produto não encontrado.</Typography>;
  }

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "row",
        maxWidth: 900,
        height: 350,
        margin: "auto",
        mt: 4,
        boxShadow: 3,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      {/* Imagem / Carrossel */}
      <Box
        sx={{
          width: "50%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Slider {...sliderSettings} style={{ width: "100%", height: "100%" }}>
          {produto.img.map((url, index) => (
            <div>
              {console.log(produto)}
              <Box
                sx={{
                  width: "100%",
                  height: "350px", // mesma altura do Card
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src={`http://localhost:3000/${url}`}
                  alt={`Produto ${index}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              </Box>
            </div>
          ))}
        </Slider>
      </Box>

      {/* Informações do produto */}
      <CardContent
        sx={{
          width: "50%",
          padding: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Typography variant="h5" gutterBottom>
            {produto.nome}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {produto.descricao}
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            <b>Preço:</b> {produto.preco} R$ <br />
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 0 }}>
            <b>Estoque:</b> {produto.estoque} unidade(s) <br />
          </Typography>

          <Typography variant="subtitle1" sx={{ mt: 0 }}>
            <b>Categoria:</b> {produto.categoria} <br />
          </Typography>
        </div>

        <button
          className={`btn-comprar ${produto.estoque <= 0 ? "disabled" : ""}`}
          disabled={produto.estoque <= 0}
          onClick={(e) => getAction(produto)}
          sx={{ width: "80%" }}
        >
          {produto.estoque > 0
            ? produto.reserva === true
              ? "Reservar"
              : "Adicionar ao Carrinho"
            : "Indisponível"}
        </button>
      </CardContent>
    </Card>
  );
};

export default ProdutoCard;
