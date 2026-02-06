import { Navigate } from 'react-router-dom';
import { useAutenticacao } from '../contextos/AutenticacaoContexto';
import type { ReactNode } from 'react';
import { Spinner, Container } from 'react-bootstrap';

interface RotaProtegidaProps {
    children: ReactNode;
    apenasAdmin?: boolean;
}

export default function RotaProtegida({ children, apenasAdmin = false }: RotaProtegidaProps) {
    const { usuario, carregando } = useAutenticacao();

    if (carregando) {
        return (
            <Container className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3 text-muted">Carregando...</p>
                </div>
            </Container>
        );
    }

    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    if (apenasAdmin && usuario.grupoNome !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
