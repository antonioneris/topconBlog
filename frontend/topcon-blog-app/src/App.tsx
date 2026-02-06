import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProvedorAutenticacao, useAutenticacao } from './contextos/AutenticacaoContexto';
import RotaProtegida from './componentes/RotaProtegida';
import BarraNavegacao from './componentes/BarraNavegacao';
import PaginaLogin from './paginas/PaginaLogin';
import PaginaRegistro from './paginas/PaginaRegistro';
import PaginaFeed from './paginas/PaginaFeed';
import PaginaUsuarios from './paginas/PaginaUsuarios';

// Importar Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Layout com navegação
function LayoutComNavegacao({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BarraNavegacao />
      <main>{children}</main>
    </>
  );
}

// Componente que redireciona se já logado
function RotaPublica({ children }: { children: React.ReactNode }) {
  const { estaAutenticado, carregando } = useAutenticacao();

  if (carregando) return null;
  if (estaAutenticado) return <Navigate to="/" replace />;

  return <>{children}</>;
}

function AppRotas() {
  return (
    <Routes>
      {/* Rotas públicas (login/registro) */}
      <Route
        path="/login"
        element={
          <RotaPublica>
            <PaginaLogin />
          </RotaPublica>
        }
      />
      <Route
        path="/registro"
        element={
          <RotaPublica>
            <PaginaRegistro />
          </RotaPublica>
        }
      />

      {/* Rotas protegidas */}
      <Route
        path="/"
        element={
          <RotaProtegida>
            <LayoutComNavegacao>
              <PaginaFeed />
            </LayoutComNavegacao>
          </RotaProtegida>
        }
      />

      {/* Rota de usuários (apenas admin) */}
      <Route
        path="/usuarios"
        element={
          <RotaProtegida apenasAdmin>
            <LayoutComNavegacao>
              <PaginaUsuarios />
            </LayoutComNavegacao>
          </RotaProtegida>
        }
      />

      {/* Rota padrão - redireciona para feed */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ProvedorAutenticacao>
        <AppRotas />
      </ProvedorAutenticacao>
    </BrowserRouter>
  );
}

export default App;
