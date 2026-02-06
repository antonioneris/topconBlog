import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAutenticacao } from '../contextos/AutenticacaoContexto';

export default function PaginaLogin() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const { login } = useAutenticacao();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');
        setCarregando(true);

        const resultado = await login({ email, senha });

        if (resultado.sucesso) {
            navigate('/');
        } else {
            setErro(resultado.mensagem);
        }

        setCarregando(false);
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f5f7fa' }}>
            <Container fluid className="px-3 px-sm-4 py-4">
                <Row className="justify-content-center m-0">
                    <Col xs={12} sm={10} md={6} lg={5} xl={4} xxl={3} className="px-0 px-sm-3">
                        <Card className="shadow-lg border-0">
                            <Card.Body className="p-4 p-md-5">
                                {/* Logo/Título */}
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold text-primary mb-1"><img src="/topconlogo.png" alt="Logo Topcon Blog" className="img-fluid" /></h2>
                                    <p className="text-muted mb-0">Faça login para continuar</p>
                                </div>

                                {erro && <Alert variant="danger" className="py-2">{erro}</Alert>}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="seu@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            autoFocus
                                            size="lg"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">Senha</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Sua senha"
                                            value={senha}
                                            onChange={(e) => setSenha(e.target.value)}
                                            required
                                            size="lg"
                                        />
                                    </Form.Group>

                                    <div className="d-grid">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            disabled={carregando}
                                        >
                                            {carregando ? (
                                                <>
                                                    <Spinner size="sm" className="me-2" />
                                                    Entrando...
                                                </>
                                            ) : (
                                                'Entrar'
                                            )}
                                        </Button>
                                    </div>
                                </Form>

                                <div className="text-center mt-4">
                                    <span className="text-muted">Não tem conta? </span>
                                    <Link to="/registro" className="fw-semibold text-primary">Cadastre-se</Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
