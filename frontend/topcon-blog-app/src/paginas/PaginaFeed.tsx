import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, Image } from 'react-bootstrap';
import { useAutenticacao } from '../contextos/AutenticacaoContexto';
import { postagemServico } from '../servicos/api';
import type { PostagemDto } from '../servicos/api';
import { ModalConfirmacao } from '../componentes/ModalConfirmacao';
import ModalVisualizacaoPostagem from '../componentes/ModalVisualizacaoPostagem';
import Modal from '../componentes/Modal';
import EditorHtml from '../componentes/EditorHtml';
import DropzoneImagem from '../componentes/DropzoneImagem';
import DOMPurify from 'dompurify';
import { getAssetUrl } from '../config/env';

interface PaginaFeedProps {
    onRegistrarCallback?: (fn: (postagem: PostagemDto) => void) => void;
}

export default function PaginaFeed({ onRegistrarCallback }: PaginaFeedProps) {
    const [postagens, setPostagens] = useState<PostagemDto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [pagina, setPagina] = useState(1);
    const [temMais, setTemMais] = useState(true);

    // Modal de visualização
    const [postagemVisualizando, setPostagemVisualizando] = useState<PostagemDto | null>(null);

    // Modal de edição
    const [postagemEditando, setPostagemEditando] = useState<PostagemDto | null>(null);
    const [tituloEdicao, setTituloEdicao] = useState('');
    const [conteudoEdicao, setConteudoEdicao] = useState('');
    const [imagemCapaEdicao, setImagemCapaEdicao] = useState<string | null>(null);

    // Modal de confirmação de exclusão
    const [idExclusao, setIdExclusao] = useState<number | null>(null);

    const { usuario } = useAutenticacao();

    // Configuração do preview
    const PREVIEW_MAX_LENGTH = 200;

    useEffect(() => {
        carregarPostagens();
    }, []);

    const carregarPostagens = async () => {
        try {
            setCarregando(true);
            const dados = await postagemServico.listar(1, 20);
            setPostagens(dados.postagens);
            setTemMais(dados.pagina < dados.totalPaginas);
            setPagina(1);
        } catch {
            setErro('Erro ao carregar postagens');
        } finally {
            setCarregando(false);
        }
    };

    const carregarMais = async () => {
        try {
            const proximaPagina = pagina + 1;
            const dados = await postagemServico.listar(proximaPagina, 20);
            setPostagens([...postagens, ...dados.postagens]);
            setTemMais(dados.pagina < dados.totalPaginas);
            setPagina(proximaPagina);
        } catch {
            setErro('Erro ao carregar mais postagens');
        }
    };

    // Callback da navbar para adicionar nova postagem
    const adicionarPostagem = (postagem: PostagemDto) => {
        setPostagens(prev => [postagem, ...prev]);
    };

    // Registrar callback para a navbar
    useEffect(() => {
        onRegistrarCallback?.(adicionarPostagem);
    }, [onRegistrarCallback]);

    // Funções de edição
    const abrirEdicao = (postagem: PostagemDto) => {
        setPostagemVisualizando(null);
        setPostagemEditando(postagem);
        setTituloEdicao(postagem.titulo);
        setConteudoEdicao(postagem.conteudo);
        setImagemCapaEdicao(postagem.imagemCapaUrl || null);
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

    // Funções de exclusão
    const iniciarExclusao = (id: number) => {
        setPostagemVisualizando(null);
        setIdExclusao(id);
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

    // Utilitários
    const formatarData = (dataStr: string) => {
        const data = new Date(dataStr);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    /**
     * Trunca conteúdo HTML para preview, removendo tags e limitando caracteres.
     */
    const truncarConteudo = (html: string, maxLength: number): string => {
        // Primeiro sanitizar, depois extrair texto puro
        const cleanHtml = DOMPurify.sanitize(html);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cleanHtml;
        const texto = tempDiv.textContent || tempDiv.innerText || '';

        if (texto.length <= maxLength) return texto;
        return texto.substring(0, maxLength).trim() + '...';
    };

    return (
        <div style={{ backgroundColor: '#f5f7fa', minHeight: 'calc(100vh - 56px)' }}>
            <Container fluid className="px-2 px-sm-3 px-md-4 px-lg-5 py-3 py-md-4">
                <Row className="justify-content-center m-0">
                    <Col xs={12} sm={12} md={10} lg={8} xl={7} xxl={6} className="px-0 px-sm-2">
                        {erro && <Alert variant="danger" dismissible onClose={() => setErro('')}>{erro}</Alert>}

                        {/* Lista de postagens */}
                        {carregando ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2 text-muted">Carregando postagens...</p>
                            </div>
                        ) : postagens.length === 0 ? (
                            <Card className="text-center py-5 shadow-sm border-0">
                                <Card.Body>
                                    <p className="display-6 mb-2"><i className="bi bi-mailbox"></i></p>
                                    <h5 className="text-muted">Nenhuma postagem ainda</h5>
                                    <p className="text-muted mb-0">Seja o primeiro a publicar algo!</p>
                                </Card.Body>
                            </Card>
                        ) : (
                            <>
                                {postagens.map((postagem) => (
                                    <Card
                                        key={postagem.id}
                                        className="mb-3 shadow-sm border-0 card-hover"
                                        onClick={() => setPostagemVisualizando(postagem)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {/* Imagem de capa (thumbnail) */}
                                        {postagem.imagemCapaUrl && (
                                            <Image
                                                src={getAssetUrl(postagem.imagemCapaUrl)}
                                                alt="Imagem de capa"
                                                fluid
                                                className="rounded-top"
                                                style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                                            />
                                        )}
                                        <Card.Body className="p-3 p-md-4">
                                            {/* Header da postagem */}
                                            <div className="d-flex justify-content-between align-items-start gap-2 mb-2 flex-wrap">
                                                <div className="flex-grow-1">
                                                    <h5 className="mb-1 fw-bold">{postagem.titulo}</h5>
                                                    <small className="text-muted">
                                                        Por <strong>{postagem.autorNome}</strong> • {formatarData(postagem.dataCriacao)}
                                                        {postagem.dataAtualizacao && ' (editado)'}
                                                    </small>
                                                </div>

                                                {/* Botões do autor */}
                                                {usuario?.id === postagem.autorId && (
                                                    <div
                                                        className="d-flex gap-2 flex-shrink-0"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            onClick={() => abrirEdicao(postagem)}
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => iniciarExclusao(postagem.id)}
                                                        >
                                                            <i className="bi bi-x-lg"></i>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Preview do conteúdo (truncado) */}
                                            <p className="mt-3 mb-0 text-muted">
                                                {truncarConteudo(postagem.conteudo, PREVIEW_MAX_LENGTH)}
                                            </p>

                                            {/* Indicador de "ver mais" */}
                                            <small className="text-primary mt-2 d-inline-block">
                                                <i className="bi bi-eye me-1"></i>
                                                Clique para ler mais
                                            </small>
                                        </Card.Body>
                                    </Card>
                                ))}

                                {temMais && (
                                    <div className="text-center py-3">
                                        <Button variant="outline-primary" onClick={carregarMais}>
                                            Carregar mais postagens
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </Col>
                </Row>
            </Container>

            {/* Modal de visualização */}
            <ModalVisualizacaoPostagem
                show={!!postagemVisualizando}
                onHide={() => setPostagemVisualizando(null)}
                postagem={postagemVisualizando}
                onEditar={abrirEdicao}
                onExcluir={iniciarExclusao}
            />

            {/* Modal de edição */}
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

            {/* Modal de confirmação de exclusão */}
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
