import './home.css';
import ProdutosComFiltro from '../../components/produtos';

function Home() {
  return (
    <div className="App">
      <header className="App-header">

        <div className="titulo-container">
          <h1 className="titulo-completo">
            <span className="texto-titulo">Catálogo</span>
            <img
              src="logotransp.png"
              alt="Ícone de estrela prateada decorativa"
              className="icone-alinhado"
            />
          </h1>
        </div>
      </header>

      <main className="App-main">
        <ProdutosComFiltro />
   
      </main>

    </div>
  );
}

export default Home;
