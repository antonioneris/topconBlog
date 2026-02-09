import { useState } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap';
import Modal from './Modal';
import EditorHtml from './EditorHtml';
import DropzoneImagem from './DropzoneImagem';
import { postagemServico } from '../servicos/api';
import type { PostagemDto, CriarPostagemDto } from '../servicos/api';

interface ModalNovaPublicacaoProps {
    show: boolean;
    onHide: () => void;
    onSuccess: (postagem: PostagemDto) => void;
}

/**
 * Modal para criar nova publicação.
 * Exibe formulário com título, imagem de capa e editor HTML.
 */
export default function ModalNovaPublicacao({
    show,
    onHide,
    onSuccess,
}: ModalNovaPublicacaoProps) {
    const [titulo, setTitulo] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [imagemCapa, setImagemCapa] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState('');

    const limparFormulario = () => {
        setTitulo('');
        setConteudo('');
        setImagemCapa(null);
        setErro('');
    };

    const handleClose = () => {
        limparFormulario();
        onHide();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!titulo.trim() || !conteudo.trim()) return;

        try {
            setEnviando(true);
            setErro('');

            const novaPostagem: CriarPostagemDto = {
                titulo: titulo.trim(),
                conteudo,
                imagemCapaUrl: imagemCapa || undefined,
            };

            const postagem = await postagemServico.criar(novaPostagem);
            onSuccess(postagem);
            handleClose();
        } catch {
            setErro('Erro ao criar publicação. Tente novamente.');
        } finally {
            setEnviando(false);
        }
    };

    const podePublicar = titulo.trim() && conteudo.trim() && !enviando;

    return (
        <Modal
            show={show}
            onHide={handleClose}
            titulo="Nova Publicação"
            subtitulo="Compartilhe algo com a equipe"
            size="lg"
            footer={
                <>
                    <Button
                        variant="outline-secondary"
                        onClick={handleClose}
                        disabled={enviando}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={!podePublicar}
                    >
                        {enviando ? (
                            <>
                                <Spinner size="sm" className="me-2" />
                                Publicando...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-send me-2"></i>
                                Publicar
                            </>
                        )}
                    </Button>
                </>
            }
        >
            <Form onSubmit={handleSubmit}>
                {erro && (
                    <div className="alert alert-danger mb-3" role="alert">
                        {erro}
                    </div>
                )}

                <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Título</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Digite o título da publicação..."
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        required
                        size="lg"
                        autoFocus
                    />
                </Form.Group>

                <DropzoneImagem
                    imagemUrl={imagemCapa}
                    onImagemChange={setImagemCapa}
                />

                <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Conteúdo</Form.Label>
                    <EditorHtml
                        value={conteudo}
                        onChange={setConteudo}
                        height={300}
                        placeholder="Escreva o conteúdo da sua publicação..."
                    />
                </Form.Group>
            </Form>
        </Modal>
    );
}
