import { useState } from 'react';
import { Navbar, Container, Nav, Badge, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAutenticacao } from '../contextos/AutenticacaoContexto';
import ModalNovaPublicacao from './ModalNovaPublicacao';
import type { PostagemDto } from '../servicos/api';

interface BarraNavegacaoProps {
    onNovaPostagem?: (postagem: PostagemDto) => void;
}

export default function BarraNavegacao({ onNovaPostagem }: BarraNavegacaoProps) {
    const { usuario, logout } = useAutenticacao();
    const navigate = useNavigate();
    const location = useLocation();
    const isAdmin = usuario?.grupoNome === 'admin';
    const [mostrarModalNova, setMostrarModalNova] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNovaPostagem = (postagem: PostagemDto) => {
        setMostrarModalNova(false);
        onNovaPostagem?.(postagem);
    };

    // Mostrar botão apenas na página do feed
    const mostrarBotaoNova = location.pathname === '/';

    return (
        <>
            <Navbar bg="white" expand="lg" className="shadow-sm sticky-top">
                <Container fluid className="px-3 px-md-4 px-lg-5">
                    {/* Logo */}
                    <Navbar.Brand as={Link} to="/" className="fw-bold text-primary fs-5">
                        <img src="/topconlogo.png" alt="Logo Topcon Blog" className="img-fluid" width={150} />
                    </Navbar.Brand>

                    {/* Toggle para mobile/tablet */}
                    <Navbar.Toggle aria-controls="navbar-nav" className="border-0" />

                    {/* Menu colapsável */}
                    <Navbar.Collapse id="navbar-nav">
                        {/* Links de navegação */}
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/" className="fw-medium px-3 py-2">
                                Feed
                            </Nav.Link>
                            {isAdmin && (
                                <Nav.Link as={Link} to="/usuarios" className="fw-medium px-3 py-2">
                                    Usuários
                                </Nav.Link>
                            )}
                        </Nav>

                        {/* Área do usuário */}
                        <Nav className="align-items-lg-center gap-2">
                            {/* Botão Nova Publicação */}
                            {mostrarBotaoNova && (
                                <Button
                                    variant="primary"
                                    onClick={() => setMostrarModalNova(true)}
                                    className="my-2 my-lg-0"
                                >
                                    <i className="bi bi-plus-lg me-2"></i>
                                    Nova Publicação
                                </Button>
                            )}

                            <div className="d-flex align-items-center py-2 py-lg-0 me-lg-2">
                                <span className="text-muted me-1 d-none d-md-inline">Olá,</span>
                                <span className="fw-semibold">{usuario?.nome}</span>
                                {isAdmin && (
                                    <Badge bg="danger" className="ms-2">Admin</Badge>
                                )}
                            </div>
                            <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={handleLogout}
                                className="my-2 my-lg-0"
                            >
                                Sair
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Modal de Nova Publicação */}
            <ModalNovaPublicacao
                show={mostrarModalNova}
                onHide={() => setMostrarModalNova(false)}
                onSuccess={handleNovaPostagem}
            />
        </>
    );
}
