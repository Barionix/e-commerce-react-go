import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import api from "../hooks/api";
import { Button } from "@mui/material";
import "./cart.css";
import axios from 'axios';
import { pdf } from "@react-pdf/renderer";
import MyDocument from "./nota";

const Chart = () => {
  const { chartID } = useParams();
  const [chart, setChart] = useState(null); // começa como null
  const [chartBind, setChartBind] = useState(null); // começa como null
  const [loading, setLoading] = useState(true);
  const [valorFinal, setValorFinal] = useState(null)
  const handleDownload = async () => {
    const blob = await pdf(
      <MyDocument chart={chart} chartBind={chartBind} />
    ).toBlob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${chartBind.code}.pdf`;
    link.click();

    URL.revokeObjectURL(url); // limpa o objeto temporário
  };

  useEffect(() => {
    const fetchChart = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/sharts/${chartID}/getChartByID`);
        setChart(JSON.parse(response.data.chartJSON));
        console.log("chart is", chart)
        setChartBind(response.data);
        console.log("CHART IS:", chart);
      } catch (error) {
        console.error("Erro ao buscar carrinho:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChart();
  }, [chartID]);

  const confirmarCompra = async (status) => {
    try {
      const formData = new FormData();
      formData.append("chart", JSON.stringify(chart));
      formData.append("code", chartBind.code);
      formData.append("preco", chartBind.preco);
      formData.append("status", status);
      formData.append("valorFinal", valorFinal ? valorFinal : chartBind.preco);
      formData.append("nome", chartBind.nome)
      chartBind.valorFinal = valorFinal ? valorFinal : chartBind.preco
      const response = await axios.post(`http://localhost:8080/sharts/confirmSale`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      handleDownload();
      alert(response.data.message);
    } catch (error) {
      console.error("Erro ao buscar carrinho:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Carregando...</Typography>;
  }

  if (chart === null) {
    return <Typography>Chart não encontrado.</Typography>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="titulo-container">
          <h1 className="titulo-completo">
            <span className="texto-titulo">Catálogo</span>
            <img
              src="/logotransp.png"
              alt="Ícone de estrela prateada decorativa"
              className="icone-alinhado"
            />
          </h1>
        </div>
      </header>

      <main className="App-main">
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
          <CardContent
            sx={{
              width: "100%",
              padding: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflowY: "auto",
            }}
          >
            <Typography variant="h5" color="text.secondary" gutterBottom>
              <b>Código:</b> {chartBind.code}
            </Typography>
            {chartBind.nome && (
            <Typography variant="h5" color="text.secondary" gutterBottom>
              <b>Cliente:</b> {chartBind.nome}
            </Typography>
            )}
            {chart.map((chartItem) => (
              <div>
                <Typography variant="h8" sx={{ mt: 2 }} gutterBottom>
                  {chartItem.nome}
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 0 }}>
                  <b>Preço:</b> {chartItem.preco} R$ <br />
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 0 }}>
                  <b>Estoque:</b> {chartItem.estoque} unidade(s) <br />
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    mt: 0,
                    borderBottom: "2px solid black",
                    paddingBottom: 3,
                  }}
                >
                  <b>Categoria:</b> {chartItem.categoria} <br />
                </Typography>
              </div>
            ))}
            <Typography
              sx={{ mt: 2 }}
              variant="h5"
              color="text.secondary"
              gutterBottom
            >
              <b>Preço Total:</b> {chartBind.preco} R$
            </Typography>
              <label style={{alignSelf: "center"}} htmlFor="valorFinal">Valor Final:</label>

            <input
              type="text"
              id="nome"
              name="nome"
              value={valorFinal !== null ? valorFinal : chartBind.preco}
              onChange={(e) => setValorFinal(e.target.value)}
               style={{ alignSelf: "center", padding: "6px 8px", marginBottom: "10px", width: "50%", borderRadius: "4px", border: "1px solid #ccc", fontSize: "14px", marginTop: "4px" }}
              required
            />
            <Button
              onClick={(e) => confirmarCompra("confirmar")}
              sx={{
                mt: 2,
                width: "50%",
                alignSelf: "center",
                backgroundColor: "#0C4B33",
                color: "#fff",
              }}
              className={`btn-comprar`}
            >
              Confirmar Compra
            </Button>
            <Button
              onClick={(e) => confirmarCompra("cancelado")}
              sx={{
                mt: 2,
                width: "50%",
                alignSelf: "center",
                backgroundColor: "#0C4B33",
                color: "#fff",
              }}
              className={`btn-comprar`}
            >
              Cancelar Compra
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Chart;
