import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, Modal, Image } from 'react-bootstrap';
import { useAutenticacao } from '../contextos/AutenticacaoContexto';
import { postagemServico } from '../servicos/api';
import type { PostagemDto, CriarPostagemDto } from '../servicos/api';
import { ModalConfirmacao } from '../componentes/ModalConfirmacao';
import EditorHtml from '../componentes/EditorHtml';
import DropzoneImagem from '../componentes/DropzoneImagem';
import DOMPurify from 'dompurify';

export default function PaginaFeed() {
    const [postagens, setPostagens] = useState<PostagemDto[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');
    const [pagina, setPagina] = useState(1);
    const [temMais, setTemMais] = useState(true);

    const [novoTitulo, setNovoTitulo] = useState('');
    const [novoConteudo, setNovoConteudo] = useState('');
    const [novaImagemCapa, setNovaImagemCapa] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);

    const [postagemEditando, setPostagemEditando] = useState<PostagemDto | null>(null);
    const [tituloEdicao, setTituloEdicao] = useState('');
    const [conteudoEdicao, setConteudoEdicao] = useState('');
    const [imagemCapaEdicao, setImagemCapaEdicao] = useState<string | null>(null);
    const [idExclusao, setIdExclusao] = useState<number | null>(null);

    const { usuario } = useAutenticacao();

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

    const criarPostagem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!novoTitulo.trim() || !novoConteudo.trim()) return;

        try {
            setEnviando(true);
            const novaPostagem: CriarPostagemDto = {
                titulo: novoTitulo,
                conteudo: novoConteudo,
                imagemCapaUrl: novaImagemCapa || undefined,
            };
            const postagem = await postagemServico.criar(novaPostagem);
            setPostagens([postagem, ...postagens]);
            setNovoTitulo('');
            setNovoConteudo('');
            setNovaImagemCapa(null);
        } catch {
            setErro('Erro ao criar postagem');
        } finally {
            setEnviando(false);
        }
    };

    const abrirEdicao = (postagem: PostagemDto) => {
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

    const excluirPostagem = (id: number) => {
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

    const renderizarHtml = (html: string) => {
        return { __html: DOMPurify.sanitize(html) };
    };

    return (
        <div style={{ backgroundColor: '#f5f7fa', minHeight: 'calc(100vh - 56px)' }}>
            <Container fluid className="px-2 px-sm-3 px-md-4 px-lg-5 py-3 py-md-4">
                <Row className="justify-content-center m-0">
                    <Col xs={12} sm={12} md={10} lg={8} xl={7} xxl={6} className="px-0 px-sm-2">
                        {/* Formulário para nova postagem */}
                        <Card className="mb-4 shadow-sm border-0">
                            <Card.Body className="p-3 p-md-4">
                                <h5 className="mb-3 fw-bold"><i className="bi bi-plus-lg"></i> Criar nova postagem</h5>
                                <Form onSubmit={criarPostagem}>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            type="text"
                                            placeholder="Título da postagem"
                                            value={novoTitulo}
                                            onChange={(e) => setNovoTitulo(e.target.value)}
                                            required
                                            size="lg"
                                        />
                                    </Form.Group>

                                    <DropzoneImagem
                                        imagemUrl={novaImagemCapa}
                                        onImagemChange={setNovaImagemCapa}
                                    />

                                    <Form.Group className="mb-3">
                                        <label className="form-label fw-semibold">Conteúdo</label>
                                        <EditorHtml
                                            value={novoConteudo}
                                            onChange={setNovoConteudo}
                                            height={250}
                                            placeholder="Escreva o conteúdo da sua postagem..."
                                        />
                                    </Form.Group>

                                    <div className="d-flex justify-content-end">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={enviando || !novoTitulo.trim() || !novoConteudo.trim()}
                                        >
                                            {enviando ? <Spinner size="sm" /> : 'Publicar'}
                                        </Button>
                                    </div>
                                </Form>
                            </Card.Body>
                        </Card>

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
                                    <Card key={postagem.id} className="mb-3 shadow-sm border-0">
                                        {/* Imagem de capa */}
                                        {postagem.imagemCapaUrl && (
                                            <Image
                                                src={`http://localhost:8080${postagem.imagemCapaUrl}`}
                                                alt="Imagem de capa"
                                                fluid
                                                className="rounded-top"
                                                style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }}
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
                                                    <div className="d-flex gap-2 flex-shrink-0">
                                                        <Button
                                                            variant="primary"
                                                            onClick={() => abrirEdicao(postagem)}
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() => excluirPostagem(postagem.id)}
                                                        >
                                                            <i className="bi bi-x-lg"></i>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Conteúdo HTML renderizado */}
                                            <div
                                                className="mt-3 post-content"
                                                dangerouslySetInnerHTML={renderizarHtml(postagem.conteudo)}
                                            />
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

            {/* Modal de edição */}
            <Modal
                show={!!postagemEditando}
                onHide={() => setPostagemEditando(null)}
                centered
                size="lg"
                fullscreen="sm-down"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Editar postagem</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setPostagemEditando(null)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={salvarEdicao}>
                        Salvar
                    </Button>
                </Modal.Footer>
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
