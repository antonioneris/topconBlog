import { Modal as BootstrapModal } from 'react-bootstrap';
import type { ReactNode } from 'react';

interface ModalProps {
    show: boolean;
    onHide: () => void;
    titulo: string;
    subtitulo?: string;
    size?: 'sm' | 'lg' | 'xl';
    fullscreenOnMobile?: boolean;
    children: ReactNode;
    footer?: ReactNode;
}

/**
 * Componente Modal genérico reutilizável.
 * Base para todos os modais da aplicação.
 */
export default function Modal({
    show,
    onHide,
    titulo,
    subtitulo,
    size = 'lg',
    fullscreenOnMobile = true,
    children,
    footer,
}: ModalProps) {
    return (
        <BootstrapModal
            show={show}
            onHide={onHide}
            centered
            size={size}
            fullscreen={fullscreenOnMobile ? 'sm-down' : undefined}
        >
            <BootstrapModal.Header closeButton>
                <div>
                    <BootstrapModal.Title className="fw-bold">
                        {titulo}
                    </BootstrapModal.Title>
                    {subtitulo && (
                        <small className="text-muted">{subtitulo}</small>
                    )}
                </div>
            </BootstrapModal.Header>

            <BootstrapModal.Body>
                {children}
            </BootstrapModal.Body>

            {footer && (
                <BootstrapModal.Footer>
                    {footer}
                </BootstrapModal.Footer>
            )}
        </BootstrapModal>
    );
}
