import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/index";
import CadastroProduto from "./pages/Cadastro/index";
import Produto from "./pages/Produto";
import Chart from "./components/cart";
import EditarProduto from "./pages/Produto/Editar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import HandleProducts from "./pages/ProdutosHandle";
import AdminRoute from "./components/AdminRoute";
import ControleEntradasSaidas from "./pages/Financeiro";
import CadastroCupom from "./pages/CadastroCupom";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/chart/:chartID" element={<Chart />} />
          <Route path="/" element={<Home />} />
          <Route path="/produto/:productId" element={<Produto />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas Admin protegidas */}
          <Route
            path="/dashboard"
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/financeiro"
            element={
              <AdminRoute>
                <ControleEntradasSaidas />
              </AdminRoute>
            }
          />
          <Route
            path="/cadastro-cupom"
            element={
              <AdminRoute>
                <CadastroCupom />
              </AdminRoute>
            }
          />

          <Route
            path="/editarProduto/:productId"
            element={
           
                <EditarProduto />
           
            }
          />
          <Route
            path="/cadastro"
            element={
           
                <CadastroProduto />
             
            }
          />
          <Route
            path="/handle-products"
            element={
              <AdminRoute>
                <HandleProducts />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
