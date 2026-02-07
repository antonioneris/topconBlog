import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useRef, useCallback } from 'react';
import { ProvedorAutenticacao, useAutenticacao } from './contextos/AutenticacaoContexto';
import RotaProtegida from './componentes/RotaProtegida';
import BarraNavegacao from './componentes/BarraNavegacao';
import PaginaLogin from './paginas/PaginaLogin';
import PaginaRegistro from './paginas/PaginaRegistro';
import PaginaFeed from './paginas/PaginaFeed';
import PaginaUsuarios from './paginas/PaginaUsuarios';
import type { PostagemDto } from './servicos/api';

// Importar Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Layout com navegação para o Feed
function LayoutFeed() {
  const adicionarPostagemRef = useRef<((postagem: PostagemDto) => void) | null>(null);

  const handleNovaPostagem = useCallback((postagem: PostagemDto) => {
    adicionarPostagemRef.current?.(postagem);
  }, []);

  const setAdicionarPostagem = useCallback((fn: (postagem: PostagemDto) => void) => {
    adicionarPostagemRef.current = fn;
  }, []);

  return (
    <>
      <BarraNavegacao onNovaPostagem={handleNovaPostagem} />
      <main>
        <PaginaFeed onRegistrarCallback={setAdicionarPostagem} />
      </main>
    </>
  );
}

// Layout genérico com navegação (para outras páginas)
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

      {/* Feed com integração de nova postagem */}
      <Route
        path="/"
        element={
          <RotaProtegida>
            <LayoutFeed />
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
