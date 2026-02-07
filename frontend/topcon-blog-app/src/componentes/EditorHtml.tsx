import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';
import { config } from '../config/env';

interface EditorHtmlProps {
    value: string;
    onChange: (content: string) => void;
    height?: number;
    placeholder?: string;
}

export default function EditorHtml({ value, onChange, height = 300, placeholder = 'Escreva seu conteúdo...' }: EditorHtmlProps) {
    const editorRef = useRef<any>(null);

    return (
        <Editor
            onInit={(_evt, editor) => editorRef.current = editor}
            value={value}
            onEditorChange={(content) => onChange(content)}
            apiKey={config.TINYMCE_API_KEY}
            init={{
                height,
                menubar: false,
                plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'help', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size: 14px; }',
                placeholder,
                language: 'pt_BR',
                skin: 'oxide',
                content_css: 'default',
                branding: false,
                promotion: false,
                statusbar: false
            }}
        />
    );
}
