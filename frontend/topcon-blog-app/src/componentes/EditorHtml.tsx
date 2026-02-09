import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';
import { config, getAssetUrl } from '../config/env';
import { imagemServico } from '../servicos/api';

interface EditorHtmlProps {
    value: string;
    onChange: (content: string) => void;
    height?: number;
    placeholder?: string;
}


export default function EditorHtml({ value, onChange, height = 300, placeholder = 'Escreva seu conteúdo...' }: EditorHtmlProps) {
    const editorRef = useRef<any>(null);


    const handleImageUpload = (
        blobInfo: { blob: () => Blob; filename: () => string },
        progress: (percent: number) => void
    ): Promise<string> => {
        return new Promise((resolve, reject) => {
            const file = new File([blobInfo.blob()], blobInfo.filename(), {
                type: blobInfo.blob().type,
            });

            progress(10);

            imagemServico.upload(file)
                .then((resultado) => {
                    progress(100);
                    if (resultado.sucesso && resultado.url) {
                        // Retorna a URL completa para acesso externo
                        resolve(getAssetUrl(resultado.url));
                    } else {
                        reject(resultado.mensagem || 'Erro ao fazer upload da imagem');
                    }
                })
                .catch((error) => {
                    console.error('Erro no upload:', error);
                    reject('Erro ao fazer upload da imagem');
                });
        });
    };

    return (
        <Editor
            onInit={(_evt, editor) => editorRef.current = editor}
            value={value}
            onEditorChange={(content) => onChange(content)}
            apiKey={config.TINYMCE_API_KEY}
            init={{
                height,
                menubar: true,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify |',
                content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; } img { max-width: 100%; height: auto; }',
                placeholder,
                language: 'pt-BR',
                skin: 'oxide',
                content_css: 'default',
                branding: false,
                promotion: false,
                statusbar: true,

                // ============================================================
                // Configurações de Upload de Imagem
                // ============================================================

                // Permite colar imagens da área de transferência (Ctrl+V)
                paste_data_images: true,

                // Handler customizado para upload de imagens
                images_upload_handler: handleImageUpload,

                // Reescreve URLs de imagem para formato absoluto
                images_reuse_filename: true,

                // Remove base64 das imagens (força upload)
                automatic_uploads: true,



                // Callback para quando o editor é inicializado
                setup: (editor) => {
                    editor.on('init', () => {
                        // Garante que popups do TinyMCE fiquem acima do modal
                        const container = document.querySelector('.tox-tinymce-aux');
                        if (container) {
                            (container as HTMLElement).style.zIndex = '10000';
                            // Impede que cliques nos menus propaguem para o modal
                            container.addEventListener('mousedown', (e) => {
                                e.stopPropagation();
                            });
                        }
                    });
                },
            }}
        />
    );
}
