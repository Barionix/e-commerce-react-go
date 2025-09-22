import './home.css';
import HandleProductFilter from '../../components/handleProducts';

function HandleProducts() {
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
        <HandleProductFilter />
   
      </main>

    </div>
  );
}

export default HandleProducts;
