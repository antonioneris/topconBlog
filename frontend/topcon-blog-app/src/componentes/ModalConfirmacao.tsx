import { Button } from 'react-bootstrap';
import Modal from './Modal';
import type { ReactNode } from 'react';

interface ModalConfirmacaoProps {
    show: boolean;
    onHide: () => void;
    onConfirm?: () => void;
    titulo: string;
    children: ReactNode;
    textoConfirmar?: string;
    textoCancelar?: string;
    variante?: string; // ex: 'danger', 'primary', 'success'
    apenasMensagem?: boolean; // Se true, esconde o botão de cancelar
}

export function ModalConfirmacao({
    show,
    onHide,
    onConfirm,
    titulo,
    children,
    textoConfirmar = 'Confirmar',
    textoCancelar = 'Cancelar',
    variante = 'primary',
    apenasMensagem = false
}: ModalConfirmacaoProps) {
    return (
        <Modal
            show={show}
            onHide={onHide}
            titulo={titulo}
            size="sm"
            footer={
                <>
                    {!apenasMensagem && (
                        <Button variant="secondary" onClick={onHide}>
                            {textoCancelar}
                        </Button>
                    )}
                    <Button variant={variante} onClick={onConfirm || onHide}>
                        {textoConfirmar}
                    </Button>
                </>
            }
        >
            {children}
        </Modal>
    );
}
