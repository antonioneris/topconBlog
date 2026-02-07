import { Button, Image } from 'react-bootstrap';
import Modal from './Modal';
import DOMPurify from 'dompurify';
import type { PostagemDto } from '../servicos/api';
import { useAutenticacao } from '../contextos/AutenticacaoContexto';

interface ModalVisualizacaoPostagemProps {
    show: boolean;
    onHide: () => void;
    postagem: PostagemDto | null;
    onEditar?: (postagem: PostagemDto) => void;
    onExcluir?: (id: number) => void;
}

/**
 * Modal para visualização completa de uma postagem.
 * Exibe conteúdo HTML sanitizado, imagem de capa e ações do autor.
 */
export default function ModalVisualizacaoPostagem({
    show,
    onHide,
    postagem,
    onEditar,
    onExcluir,
}: ModalVisualizacaoPostagemProps) {
    const { usuario } = useAutenticacao();

    if (!postagem) return null;

    const ehAutor = usuario?.id === postagem.autorId;

    const formatarData = (dataStr: string) => {
        const data = new Date(dataStr);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const renderizarHtml = (html: string) => {
        return { __html: DOMPurify.sanitize(html) };
    };

    const handleEditar = () => {
        onHide();
        onEditar?.(postagem);
    };

    const handleExcluir = () => {
        onHide();
        onExcluir?.(postagem.id);
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            titulo={postagem.titulo}
            subtitulo={`Por ${postagem.autorNome} • ${formatarData(postagem.dataCriacao)}${postagem.dataAtualizacao ? ' (editado)' : ''}`}
            size="xl"
            footer={
                ehAutor ? (
                    <>
                        <Button variant="outline-secondary" onClick={onHide}>
                            Fechar
                        </Button>
                        <Button variant="primary" onClick={handleEditar}>
                            <i className="bi bi-pencil-square me-2"></i>
                            Editar
                        </Button>
                        <Button variant="danger" onClick={handleExcluir}>
                            <i className="bi bi-trash me-2"></i>
                            Excluir
                        </Button>
                    </>
                ) : (
                    <Button variant="outline-secondary" onClick={onHide}>
                        Fechar
                    </Button>
                )
            }
        >
            {/* Imagem de capa */}
            {postagem.imagemCapaUrl && (
                <div className="mb-4 mx-n3 mt-n3">
                    <Image
                        src={`http://localhost:8080${postagem.imagemCapaUrl}`}
                        alt="Imagem de capa"
                        fluid
                        className="w-100"
                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                </div>
            )}

            {/* Conteúdo HTML renderizado */}
            <div
                className="post-content"
                dangerouslySetInnerHTML={renderizarHtml(postagem.conteudo)}
            />
        </Modal>
    );
}
