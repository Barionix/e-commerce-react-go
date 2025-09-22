import './index.css';
import ProdutoCard from '../../components/produto';
function Produto() {
  return (
    <div className="App">
      <header className="App-header">

        <div className="titulo-container">
          <h1 className="titulo-completo">
            <span className="texto-titulo" sx={{fontFamily: 'Great Vibes'}}>Catálogo</span>
            <img
              src="/logotransp.png"
              className="icone-alinhado"
            />
          </h1>
        </div>
      </header>

      <main className="App-main">
        <ProdutoCard />
   
      </main>

    </div>
  );
}

export default Produto;
