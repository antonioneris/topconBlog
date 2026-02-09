import { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useAutenticacao } from '../contextos/AutenticacaoContexto';
import { postagemServico } from '../servicos/api';
import type { PostagemDto } from '../servicos/api';
import { ModalConfirmacao } from '../componentes/ModalConfirmacao';
import ModalVisualizacaoPostagem from '../componentes/ModalVisualizacaoPostagem';
import Modal from '../componentes/Modal';
import EditorHtml from '../componentes/EditorHtml';
import DropzoneImagem from '../componentes/DropzoneImagem';
import { Form } from 'react-bootstrap';
import ModalNovaPublicacao from '../componentes/ModalNovaPublicacao';

export default function PaginaMinhasPostagens() {
    const [postagens, setPostagens] = useState<PostagemDto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');
    const { usuario } = useAutenticacao();

    // Modais
    const [postagemVisualizando, setPostagemVisualizando] = useState<PostagemDto | null>(null);
    const [postagemEditando, setPostagemEditando] = useState<PostagemDto | null>(null);
    const [idExclusao, setIdExclusao] = useState<number | null>(null);
    const [mostrarModalNova, setMostrarModalNova] = useState(false);

    // Estado de Edição
    const [tituloEdicao, setTituloEdicao] = useState('');
    const [conteudoEdicao, setConteudoEdicao] = useState('');
    const [imagemCapaEdicao, setImagemCapaEdicao] = useState<string | null>(null);

    const carregarMinhasPostagens = useCallback(async () => {
        if (!usuario) return;

        try {
            setCarregando(true);
            const dados = await postagemServico.listar(1, 100, undefined, usuario.id);
            setPostagens(dados.postagens);
        } catch {
            setErro('Erro ao carregar suas postagens');
        } finally {
            setCarregando(false);
        }
    }, [usuario]);

    useEffect(() => {
        carregarMinhasPostagens();
    }, [carregarMinhasPostagens]);

    // Ações
    const handleNovaPostagem = (postagem: PostagemDto) => {
        setPostagens([postagem, ...postagens]);
        setMostrarModalNova(false);
        setSucesso('Postagem criada com sucesso!');
        setTimeout(() => setSucesso(''), 3000);
    };

    const abrirVisualizacao = (postagem: PostagemDto) => {
        setPostagemVisualizando(postagem);
    };

    const abrirEdicao = (postagem: PostagemDto) => {
        setPostagemVisualizando(null);
        setPostagemEditando(postagem);
        setTituloEdicao(postagem.titulo);
        setConteudoEdicao(postagem.conteudo);
        setImagemCapaEdicao(postagem.imagemCapaUrl || null);
    };

    const iniciarExclusao = (id: number) => {
        setPostagemVisualizando(null);
        setIdExclusao(id);
    };

    const salvarEdicao = async () => {
        if (!postagemEditando) return;

        try {
            const atualizada = await postagemServico.atualizar(postagemEditando.id, {
                titulo: tituloEdicao,
                conteudo: conteudoEdicao,
                imagemCapaUrl: imagemCapaEdicao || undefined,
            });
            setPostagens(postagens.map(p => p.id === atualizada.id ? atualizada : p));
            setPostagemEditando(null);
            setSucesso('Postagem atualizada com sucesso!');
            setTimeout(() => setSucesso(''), 3000);
        } catch {
            setErro('Erro ao atualizar postagem');
        }
    };

    const confirmarExclusao = async () => {
        if (idExclusao === null) return;
        try {
            await postagemServico.remover(idExclusao);
            setPostagens(postagens.filter(p => p.id !== idExclusao));
            setSucesso('Postagem excluída com sucesso!');
            setTimeout(() => setSucesso(''), 3000);
        } catch {
            setErro('Erro ao excluir postagem');
        } finally {
            setIdExclusao(null);
        }
    };

    const formatarData = (dataStr: string) => {
        return new Date(dataStr).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    if (carregando) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-muted">Carregando suas postagens...</p>
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
                                    <h4 className="mb-0 fw-bold"><i className="bi bi-journal-text"></i> Gerenciar Postagens</h4>
                                    <Button variant="primary" onClick={() => setMostrarModalNova(true)}>
                                        <i className="bi bi-plus-lg me-2"></i>
                                        Nova Postagem
                                    </Button>
                                </div>
                            </Card.Header>

                            <Card.Body className="p-0">
                                {erro && <Alert variant="danger" dismissible onClose={() => setErro('')} className="m-3 mb-0">{erro}</Alert>}
                                {sucesso && <Alert variant="success" dismissible onClose={() => setSucesso('')} className="m-3 mb-0">{sucesso}</Alert>}

                                {postagens.length === 0 ? (
                                    <div className="text-center py-5">
                                        <p className="display-6 mb-2"><i className="bi bi-file-earmark-text"></i></p>
                                        <h5 className="text-muted">Você ainda não tem postagens</h5>
                                        <div className="mt-3">
                                            <Button variant="outline-primary" onClick={() => setMostrarModalNova(true)}>
                                                Criar minha primeira postagem
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* DESKTOP: Tabela (visível em lg+) */}
                                        <div className="d-none d-lg-block table-responsive">
                                            <Table hover className="mb-0 align-middle">
                                                <thead className="bg-light">
                                                    <tr>
                                                        <th className="ps-4" style={{ width: '40%' }}>Título</th>
                                                        <th>Data</th>
                                                        <th className="text-center">Status</th>
                                                        <th className="text-end pe-4">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {postagens.map((postagem) => (
                                                        <tr key={postagem.id}>
                                                            <td className="ps-4 fw-semibold text-truncate" style={{ maxWidth: '300px' }}>
                                                                {postagem.titulo}
                                                            </td>
                                                            <td>{formatarData(postagem.dataCriacao)}</td>
                                                            <td className="text-center">
                                                                <Badge bg="success" pill>Publicado</Badge>
                                                            </td>
                                                            <td className="text-end pe-4">
                                                                <Button
                                                                    variant="info"
                                                                    //size="" 
                                                                    className="me-1 text-white"
                                                                    onClick={() => abrirVisualizacao(postagem)}
                                                                >
                                                                    <i className="bi bi-eye"></i>
                                                                </Button>
                                                                <Button
                                                                    variant="primary"
                                                                    //size="" 
                                                                    className="me-1"
                                                                    onClick={() => abrirEdicao(postagem)}
                                                                >
                                                                    <i className="bi bi-pencil-square"></i>
                                                                </Button>
                                                                <Button
                                                                    variant="danger"
                                                                    //size="" 
                                                                    onClick={() => iniciarExclusao(postagem.id)}
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
                                            {postagens.map((postagem) => (
                                                <div key={postagem.id} className="border-bottom p-3">
                                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                                        <div>
                                                            <h6 className="mb-1 fw-bold">{postagem.titulo}</h6>
                                                            <small className="text-muted">{formatarData(postagem.dataCriacao)}</small>
                                                        </div>
                                                        <Badge bg="success" pill>Publicado</Badge>
                                                    </div>

                                                    <div className="d-flex justify-content-end gap-2 mt-3">
                                                        <Button
                                                            variant="info"
                                                            className="text-white"
                                                            onClick={() => abrirVisualizacao(postagem)}
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </Button>
                                                        <Button
                                                            variant="primary"
                                                            onClick={() => abrirEdicao(postagem)}
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => iniciarExclusao(postagem.id)}
                                                        >
                                                            <i className="bi bi-x-lg"></i>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Modais */}
            <ModalNovaPublicacao
                show={mostrarModalNova}
                onHide={() => setMostrarModalNova(false)}
                onSuccess={handleNovaPostagem}
            />

            <ModalVisualizacaoPostagem
                show={!!postagemVisualizando}
                onHide={() => setPostagemVisualizando(null)}
                postagem={postagemVisualizando}
                onEditar={abrirEdicao}
                onExcluir={iniciarExclusao}
            />

            <Modal
                show={!!postagemEditando}
                onHide={() => setPostagemEditando(null)}
                titulo="Editar Publicação"
                size="lg"
                footer={
                    <>
                        <Button variant="outline-secondary" onClick={() => setPostagemEditando(null)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={salvarEdicao}>
                            <i className="bi bi-check-lg me-2"></i>
                            Salvar
                        </Button>
                    </>
                }
            >
                <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Título</Form.Label>
                    <Form.Control
                        type="text"
                        value={tituloEdicao}
                        onChange={(e) => setTituloEdicao(e.target.value)}
                        size="lg"
                    />
                </Form.Group>

                <DropzoneImagem
                    imagemUrl={imagemCapaEdicao}
                    onImagemChange={setImagemCapaEdicao}
                />

                <Form.Group>
                    <Form.Label className="fw-semibold">Conteúdo</Form.Label>
                    <EditorHtml
                        value={conteudoEdicao}
                        onChange={setConteudoEdicao}
                        height={300}
                    />
                </Form.Group>
            </Modal>

            <ModalConfirmacao
                show={!!idExclusao}
                onHide={() => setIdExclusao(null)}
                onConfirm={confirmarExclusao}
                titulo="Confirmar exclusão"
                variante="danger"
                textoConfirmar="Excluir"
            >
                Tem certeza que deseja excluir esta postagem?
            </ModalConfirmacao>
        </div>
    );
}
