import { useState, useRef, useCallback } from 'react';
import { Card, Button, Image, Alert, Spinner } from 'react-bootstrap';
import { imagemServico } from '../servicos/api';

interface DropzoneImagemProps {
    imagemUrl?: string | null;
    onImagemChange: (url: string | null) => void;
}

export default function DropzoneImagem({ imagemUrl, onImagemChange }: DropzoneImagemProps) {
    const [arrastando, setArrastando] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setArrastando(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setArrastando(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setArrastando(false);
        const arquivos = e.dataTransfer.files;
        if (arquivos.length > 0) {
            processarArquivo(arquivos[0]);
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const arquivos = e.target.files;
        if (arquivos && arquivos.length > 0) {
            processarArquivo(arquivos[0]);
        }
    };

    const processarArquivo = async (arquivo: File) => {
        setErro('');

        // Validar tipo
        if (!arquivo.type.startsWith('image/')) {
            setErro('Selecione um arquivo de imagem');
            return;
        }

        // Validar tamanho (5MB)
        if (arquivo.size > 5 * 1024 * 1024) {
            setErro('A imagem deve ter no máximo 5MB');
            return;
        }

        try {
            setCarregando(true);
            const resultado = await imagemServico.upload(arquivo);
            if (resultado.sucesso && resultado.url) {
                onImagemChange(resultado.url);
            } else {
                setErro(resultado.mensagem || 'Erro ao fazer upload');
            }
        } catch {
            setErro('Erro ao fazer upload da imagem');
        } finally {
            setCarregando(false);
        }
    };

    const removerImagem = () => {
        onImagemChange(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className="mb-3">
            <label className="form-label fw-semibold">
                <i className="bi bi-image me-2"></i>
                Imagem de capa (opcional)
            </label>

            {erro && <Alert variant="danger" dismissible onClose={() => setErro('')}>{erro}</Alert>}

            {imagemUrl ? (
                <Card className="border">
                    <div className="position-relative">
                        <Image
                            src={`http://localhost:8080${imagemUrl}`}
                            alt="Imagem de capa"
                            fluid
                            className="rounded-top"
                            style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                        />
                        <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-2"
                            onClick={removerImagem}
                        >
                            <i className="bi bi-x-lg"></i>
                        </Button>
                    </div>
                </Card>
            ) : (
                <Card
                    className={`border-2 border-dashed text-center p-4 ${arrastando ? 'border-primary bg-light' : 'border-secondary'}`}
                    style={{ cursor: 'pointer' }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    <Card.Body>
                        {carregando ? (
                            <>
                                <Spinner animation="border" variant="primary" className="mb-2" />
                                <p className="text-muted mb-0">Enviando imagem...</p>
                            </>
                        ) : (
                            <>
                                <i className="bi bi-cloud-arrow-up display-4 text-muted mb-2"></i>
                                <p className="mb-1 fw-semibold">Arraste uma imagem aqui</p>
                                <p className="text-muted small mb-0">ou clique para selecionar (máx. 5MB)</p>
                            </>
                        )}
                    </Card.Body>
                </Card>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="d-none"
                onChange={handleFileSelect}
            />
        </div>
    );
}
