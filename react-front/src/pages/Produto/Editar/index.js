import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./editar.css";
import api from "../../../hooks/api";
import axios from 'axios';

const EditarProduto = () => {
  const { productId } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);

  const categorias = [
    "colares",
    "brincos",
    "pulseiras",
    "pingentes",
    "produtos",
    "aneis",
  ];

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/produtos/${productId}/getProductByID`);
        setProduto(response.data);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduto();
  }, [productId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files); // converte FileList para array
    console.log(filesArray);
    setProduto((prev) => ({
      ...prev,
      img_upload: filesArray, // armazena o array com todos os arquivos
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nome", produto.nome);
    formData.append("descricao", produto.descricao);
    formData.append("preco", produto.preco);
    formData.append("precoComDesconto", produto.precoComDesconto);
    formData.append("categoria", produto.categoria);
    formData.append("estoque", produto.estoque);
    produto.img_upload?.forEach((file) => {
      formData.append("img_upload", file);
    });
    formData.append("reserva", produto.reserva); // Adiciona o valor da reserva

    console.log(formData, produto);
    try {
      await axios
        .post(`http://localhost:8080/produtos/${productId}/editarProduto`, formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Necessário para enviar arquivos
          },
        })
        .then((rs) => {
          alert("Produto editado com sucesso!");
          setProduto({
            nome: "",
            descricao: "",
            preco: "",
            precoComDesconto: "",
            categoria: "",
            estoque: "",
            img_upload: null,
            reserva: "estoque", // Reseta o valor padrão
          });
        })
        .catch((err) => {
          console.error(err);
          alert("Erro ao editar o produto!");
        });
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="titulo-container">
          <h1 className="titulo-completo">
            <span className="texto-titulo">Cadastro de Produto</span>
            <img
              src="/logotransp.png"
              alt="Ícone de estrela prateada decorativa"
              className="icone-alinhado"
            />
          </h1>
        </div>
      </header>
      <main className="App-main">
        <div className="cadastro-container">
          <form className="cadastro-form">
            <div className="form-group">
              <label htmlFor="nome">Nome:</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={produto?.nome}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="descricao">Descrição:</label>
              <textarea
                id="descricao"
                name="descricao"
                value={produto?.descricao}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="preco">Preço:</label>
              <input
                type="number"
                id="preco"
                name="preco"
                value={produto?.preco}
                onChange={handleChange}
                required
                step="0.01"
              />
            </div>
               <div className="form-group">
              <label htmlFor="preco">Preço com Desconto:</label>
              <input
                type="number"
                id="precoComDesconto"
                name="precoComDesconto"
                value={produto?.precoComDesconto}
                onChange={handleChange}
                required
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label htmlFor="categoria">Categoria:</label>
              <select
                id="categoria"
                name="categoria"
                value={produto?.categoria}
                onChange={handleChange}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="reserva">Tipo:</label>
              <select
                id="reserva"
                name="reserva"
                value={produto?.reserva}
                onChange={handleChange}
                required
              >
                <option value="false">Estoque</option>
                <option value="true">Reserva</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="estoque">Estoque:</label>
              <input
                type="number"
                id="estoque"
                name="estoque"
                value={produto?.estoque}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="img_upload">Imagens:</label>
              <input
                type="file"
                id="img_upload"
                name="img_upload"
                accept="image/*" // Aceita apenas arquivos de imagem
                onChange={handleFileChange}
                multiple // Permite múltiplos arquivos
                required
              />
            </div>

            <button onClick={(e) => handleSubmit(e)} className="btn-cadastrar">
              Atualizar Produto
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditarProduto;
