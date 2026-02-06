import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useAutenticacao } from '../contextos/AutenticacaoContexto';

export default function PaginaRegistro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const { registrar } = useAutenticacao();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro('');

        if (senha !== confirmarSenha) {
            setErro('As senhas não conferem');
            return;
        }

        if (senha.length < 6) {
            setErro('A senha deve ter pelo menos 6 caracteres');
            return;
        }

        setCarregando(true);

        const resultado = await registrar({ nome, email, senha });

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
                    <Col xs={12} sm={10} md={8} lg={6} xl={5} xxl={4} className="px-0 px-sm-3">
                        <Card className="shadow-lg border-0">
                            <Card.Body className="p-4 p-md-5">
                                {/* Título */}
                                <div className="text-center mb-4">
                                    <h2 className="fw-bold text-primary mb-1">Criar Conta</h2>
                                    <p className="text-muted mb-0">Preencha os dados para se cadastrar</p>
                                </div>

                                {erro && <Alert variant="danger" className="py-2">{erro}</Alert>}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Nome completo</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Seu nome"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            required
                                            autoFocus
                                            size="lg"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="seu@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            size="lg"
                                        />
                                    </Form.Group>

                                    {/* Senha - lado a lado em tablet+ */}
                                    <Row className="g-3">
                                        <Col xs={12} md={6}>
                                            <Form.Group>
                                                <Form.Label className="fw-semibold">Senha</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Mínimo 6 caracteres"
                                                    value={senha}
                                                    onChange={(e) => setSenha(e.target.value)}
                                                    required
                                                    size="lg"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Form.Group>
                                                <Form.Label className="fw-semibold">Confirmar Senha</Form.Label>
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Digite novamente"
                                                    value={confirmarSenha}
                                                    onChange={(e) => setConfirmarSenha(e.target.value)}
                                                    required
                                                    size="lg"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <div className="d-grid mt-4">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            disabled={carregando}
                                        >
                                            {carregando ? (
                                                <>
                                                    <Spinner size="sm" className="me-2" />
                                                    Cadastrando...
                                                </>
                                            ) : (
                                                'Cadastrar'
                                            )}
                                        </Button>
                                    </div>
                                </Form>

                                <div className="text-center mt-4">
                                    <span className="text-muted">Já tem conta? </span>
                                    <Link to="/login" className="fw-semibold text-primary">Fazer login</Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
