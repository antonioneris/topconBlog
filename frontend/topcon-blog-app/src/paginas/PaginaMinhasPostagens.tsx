import { useState, useEffect, useCallback } from 'react';
import { Container, Table, Button, Spinner, Alert, Card } from 'react-bootstrap';
import { useAutenticacao } from '../contextos/AutenticacaoContexto';
import { postagemServico } from '../servicos/api';
import type { PostagemDto } from '../servicos/api';
import { ModalConfirmacao } from '../componentes/ModalConfirmacao';
import ModalVisualizacaoPostagem from '../componentes/ModalVisualizacaoPostagem';
import Modal from '../componentes/Modal';
import EditorHtml from '../componentes/EditorHtml';
import DropzoneImagem from '../componentes/DropzoneImagem';
import { Form } from 'react-bootstrap';

export default function PaginaMinhasPostagens() {
    const [postagens, setPostagens] = useState<PostagemDto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const { usuario } = useAutenticacao();

    // Modais
    const [postagemVisualizando, setPostagemVisualizando] = useState<PostagemDto | null>(null);
    const [postagemEditando, setPostagemEditando] = useState<PostagemDto | null>(null);
    const [idExclusao, setIdExclusao] = useState<number | null>(null);

    // Estado de Edição
    const [tituloEdicao, setTituloEdicao] = useState('');
    const [conteudoEdicao, setConteudoEdicao] = useState('');
    const [imagemCapaEdicao, setImagemCapaEdicao] = useState<string | null>(null);

    const carregarMinhasPostagens = useCallback(async () => {
        if (!usuario) return;

        try {
            setCarregando(true);
            // Passa autorId para filtrar apenas as postagens do usuário logado
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
        } catch {
            setErro('Erro ao atualizar postagem');
        }
    };

    const confirmarExclusao = async () => {
        if (idExclusao === null) return;
        try {
            await postagemServico.remover(idExclusao);
            setPostagens(postagens.filter(p => p.id !== idExclusao));
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
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (carregando) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Carregando suas postagens...</p>
            </div>
        );
    }

    return (
        <Container className="py-4">
            <h2 className="mb-4">Minhas Postagens</h2>

            {erro && <Alert variant="danger" dismissible onClose={() => setErro('')}>{erro}</Alert>}

            {postagens.length === 0 ? (
                <Card className="text-center py-5 shadow-sm">
                    <Card.Body>
                        <h5 className="text-muted">Você ainda não tem postagens</h5>
                        <p className="text-muted">Crie sua primeira postagem na página inicial!</p>
                        <Button href="/" variant="primary">Ir para o Feed</Button>
                    </Card.Body>
                </Card>
            ) : (
                <Card className="shadow-sm border-0">
                    <Table responsive hover className="m-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th style={{ width: '40%' }}>Título</th>
                                <th style={{ width: '20%' }}>Data</th>
                                <th style={{ width: '20%' }} className="text-center">Status</th>
                                <th style={{ width: '20%' }} className="text-end">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {postagens.map((postagem) => (
                                <tr key={postagem.id}>
                                    <td className="fw-semibold text-truncate" style={{ maxWidth: '300px' }}>
                                        {postagem.titulo}
                                    </td>
                                    <td>{formatarData(postagem.dataCriacao)}</td>
                                    <td className="text-center">
                                        <span className="badge bg-success rounded-pill">Publicado</span>
                                    </td>
                                    <td className="text-end">
                                        <div className="d-flex gap-1 justify-content-end">
                                            <Button
                                                variant="outline-info"
                                                size="sm"
                                                onClick={() => abrirVisualizacao(postagem)}
                                                title="Visualizar"
                                            >
                                                <i className="bi bi-eye"></i>
                                            </Button>
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => abrirEdicao(postagem)}
                                                title="Editar"
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => iniciarExclusao(postagem.id)}
                                                title="Excluir"
                                            >
                                                <i className="bi bi-trash"></i>
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            )}

            {/* Modais */}
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
        </Container>
    );
}
