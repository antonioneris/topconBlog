import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { usuarioServico } from '../servicos/api';
import type { UsuarioDto, GrupoDto, CriarUsuarioDto, AtualizarUsuarioDto } from '../servicos/api';
import { ModalConfirmacao } from '../componentes/ModalConfirmacao';

export default function PaginaUsuarios() {
    const [usuarios, setUsuarios] = useState<UsuarioDto[]>([]);
    const [grupos, setGrupos] = useState<GrupoDto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    const [mostrarModal, setMostrarModal] = useState(false);
    const [usuarioEditando, setUsuarioEditando] = useState<UsuarioDto | null>(null);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [grupoId, setGrupoId] = useState(2);
    const [ativo, setAtivo] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [idExclusao, setIdExclusao] = useState<number | null>(null);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        try {
            setCarregando(true);
            const [usuariosData, gruposData] = await Promise.all([
                usuarioServico.listar(),
                usuarioServico.listarGrupos(),
            ]);
            setUsuarios(usuariosData);
            setGrupos(gruposData);
        } catch {
            setErro('Erro ao carregar dados');
        } finally {
            setCarregando(false);
        }
    };

    const abrirModalNovo = () => {
        setUsuarioEditando(null);
        setNome('');
        setEmail('');
        setSenha('');
        setGrupoId(2);
        setAtivo(true);
        setMostrarModal(true);
    };

    const abrirModalEdicao = (usuario: UsuarioDto) => {
        setUsuarioEditando(usuario);
        setNome(usuario.nome);
        setEmail(usuario.email);
        setSenha('');
        setGrupoId(usuario.grupoId);
        setAtivo(usuario.ativo);
        setMostrarModal(true);
    };

    const fecharModal = () => {
        setMostrarModal(false);
        setUsuarioEditando(null);
    };

    const salvarUsuario = async (e: React.FormEvent) => {
        e.preventDefault();
        setSalvando(true);
        setErro('');

        try {
            if (usuarioEditando) {
                const dados: AtualizarUsuarioDto = { nome, email, grupoId, ativo };
                if (senha) dados.senha = senha;
                const atualizado = await usuarioServico.atualizar(usuarioEditando.id, dados);
                setUsuarios(usuarios.map(u => u.id === atualizado.id ? atualizado : u));
                setSucesso('Usuário atualizado com sucesso!');
            } else {
                const dados: CriarUsuarioDto = { nome, email, senha, grupoId };
                const novo = await usuarioServico.criar(dados);
                setUsuarios([...usuarios, novo]);
                setSucesso('Usuário criado com sucesso!');
            }
            fecharModal();
        } catch {
            setErro('Erro ao salvar usuário');
        } finally {
            setSalvando(false);
        }
    };

    const excluirUsuario = (id: number) => {
        setIdExclusao(id);
    };

    const confirmarExclusao = async () => {
        if (idExclusao === null) return;
        try {
            await usuarioServico.remover(idExclusao);
            setUsuarios(usuarios.filter(u => u.id !== idExclusao));
        } catch {
            setErro('Erro ao excluir usuário');
        } finally {
            setIdExclusao(null);
        }
    };

    const formatarData = (dataStr: string) => {
        return new Date(dataStr).toLocaleDateString('pt-BR');
    };

    if (carregando) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Carregando usuários...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f5f7fa', minHeight: 'calc(100vh - 56px)' }}>
            <Container fluid className="px-2 px-sm-3 px-md-4 px-lg-5 py-3 py-md-4">
                <Row className="m-0">
                    <Col xs={12} className="px-0 px-sm-2">
                        <Card className="shadow-sm border-0">
                            {/* Header */}
                            <Card.Header className="bg-white py-3 border-bottom">
                                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2">
                                    <h4 className="mb-0 fw-bold"><i className="bi bi-people-fill"></i> Gerenciamento de Usuários</h4>
                                    <Button variant="primary" onClick={abrirModalNovo}>
                                        + Novo Usuário
                                    </Button>
                                </div>
                            </Card.Header>

                            <Card.Body className="p-0">
                                {erro && <Alert variant="danger" dismissible onClose={() => setErro('')} className="m-3 mb-0">{erro}</Alert>}
                                {sucesso && <Alert variant="success" dismissible onClose={() => setSucesso('')} className="m-3 mb-0">{sucesso}</Alert>}

                                {/* DESKTOP: Tabela (visível em lg+) */}
                                <div className="d-none d-lg-block table-responsive">
                                    <Table hover className="mb-0 align-middle">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="ps-4">Nome</th>
                                                <th>Email</th>
                                                <th>Grupo</th>
                                                <th>Status</th>
                                                <th>Criação</th>
                                                <th className="text-end pe-4">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usuarios.map((usuario) => (
                                                <tr key={usuario.id}>
                                                    <td className="ps-4 fw-semibold">{usuario.nome}</td>
                                                    <td>{usuario.email}</td>
                                                    <td>
                                                        <Badge bg={usuario.grupoNome === 'admin' ? 'danger' : 'secondary'}>
                                                            {usuario.grupoNome}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Badge bg={usuario.ativo ? 'success' : 'warning'}>
                                                            {usuario.ativo ? 'Ativo' : 'Inativo'}
                                                        </Badge>
                                                    </td>
                                                    <td>{formatarData(usuario.dataCriacao)}</td>
                                                    <td className="text-end pe-4">
                                                        <Button
                                                            variant="primary"
                                                            //size=""
                                                            className="me-1"
                                                            onClick={() => abrirModalEdicao(usuario)}
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            //size="sm"
                                                            onClick={() => excluirUsuario(usuario.id)}
                                                        >
                                                            <i className="bi bi-x-lg"></i>
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>

                                {/* MOBILE/TABLET: Cards (visível em <lg) */}
                                <div className="d-lg-none">
                                    {usuarios.map((usuario) => (
                                        <div key={usuario.id} className="border-bottom p-3">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <h6 className="mb-0 fw-bold">{usuario.nome}</h6>
                                                    <small className="text-muted">{usuario.email}</small>
                                                </div>
                                                <Badge bg={usuario.grupoNome === 'admin' ? 'danger' : 'secondary'}>
                                                    {usuario.grupoNome}
                                                </Badge>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <Badge bg={usuario.ativo ? 'success' : 'warning'} className="me-2">
                                                        {usuario.ativo ? 'Ativo' : 'Inativo'}
                                                    </Badge>
                                                    <small className="text-muted">Desde {formatarData(usuario.dataCriacao)}</small>
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <Button
                                                        variant="primary"
                                                        //size="lg"
                                                        onClick={() => abrirModalEdicao(usuario)}
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        //size="lg"
                                                        onClick={() => excluirUsuario(usuario.id)}
                                                    >
                                                        <i className="bi bi-x-lg"></i>

                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {usuarios.length === 0 && (
                                    <div className="text-center py-5">
                                        <p className="text-muted mb-0">Nenhum usuário cadastrado</p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Modal de Cadastro/Edição */}
            <Modal show={mostrarModal} onHide={fecharModal} centered fullscreen="sm-down" size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">
                        {usuarioEditando ? 'Editar Usuário' : 'Novo Usuário'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={salvarUsuario}>
                    <Modal.Body>
                        <Row className="g-3">
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Nome</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={nome}
                                        onChange={(e) => setNome(e.target.value)}
                                        required
                                        size="lg"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        size="lg"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">
                                        Senha {usuarioEditando && <small className="text-muted fw-normal">(deixe em branco para manter)</small>}
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        required={!usuarioEditando}
                                        size="lg"
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group>
                                    <Form.Label className="fw-semibold">Grupo</Form.Label>
                                    <Form.Select
                                        value={grupoId}
                                        onChange={(e) => setGrupoId(Number(e.target.value))}
                                        size="lg"
                                    >
                                        {grupos.map((grupo) => (
                                            <option key={grupo.id} value={grupo.id}>
                                                {grupo.nome}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            {usuarioEditando && (
                                <Col xs={12}>
                                    <Form.Check
                                        type="switch"
                                        label={ativo ? 'Usuário Ativo' : 'Usuário Inativo'}
                                        checked={ativo}
                                        onChange={(e) => setAtivo(e.target.checked)}
                                        className="mt-2"
                                    />
                                </Col>
                            )}
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-secondary" onClick={fecharModal}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" disabled={salvando}>
                            {salvando ? <Spinner size="sm" /> : 'Salvar'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <ModalConfirmacao
                show={!!idExclusao}
                onHide={() => setIdExclusao(null)}
                onConfirm={confirmarExclusao}
                titulo="Confirmar exclusão"
                variante="danger"
                textoConfirmar="Excluir" >
                Tem certeza que deseja excluir esta Usuario?
            </ModalConfirmacao>
        </div>
    );
}
