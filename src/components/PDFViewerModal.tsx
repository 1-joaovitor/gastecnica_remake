'use client';

import {
    Dialog,
    DialogHeader,
    DialogBody,
    IconButton,
    Button,
    Typography,
} from "@material-tailwind/react";
import { XMarkIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from 'react';

interface PDFViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
    billId: string;
    billBeneficiary?: string;
    onDownload?: () => void;
}

const PDFViewerModal = ({
    isOpen,
    onClose,
    billId,
    billBeneficiary,
    onDownload
}: PDFViewerModalProps) => {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [iframeError, setIframeError] = useState(false);
    const pdfUrlRef = useRef<string | null>(null);

    useEffect(() => {
        if (isOpen && billId) {
            loadPDF();
        } else {
            // Limpar URL quando o modal fechar
            if (pdfUrlRef.current) {
                URL.revokeObjectURL(pdfUrlRef.current);
                pdfUrlRef.current = null;
                setPdfUrl(null);
            }
            setIframeError(false);
        }

        return () => {
            // Limpar URL quando o componente desmontar
            if (pdfUrlRef.current) {
                URL.revokeObjectURL(pdfUrlRef.current);
                pdfUrlRef.current = null;
            }
        };
    }, [isOpen, billId]);

    const loadPDF = async () => {
        try {
            setLoading(true);
            setError(null);

            // Importar a função de download do service
            const { downloadBillPDF } = await import('@/services/bill');
            // Passar inline=true para visualização
            const blob = await downloadBillPDF(billId, true);
            
            // Verificar se o blob é válido
            if (!blob || blob.size === 0) {
                throw new Error('PDF vazio ou inválido');
            }
            
            // Verificar se é realmente um PDF
            if (blob.type && !blob.type.includes('pdf') && !blob.type.includes('application/octet-stream')) {
                console.warn('Tipo de arquivo inesperado:', blob.type);
            }
            
            const url = window.URL.createObjectURL(blob);
            pdfUrlRef.current = url;
            setPdfUrl(url);
            setIframeError(false);
        } catch (err: any) {
            console.error('Erro ao carregar PDF:', err);
            let errorMessage = 'Erro ao carregar PDF';
            
            if (err?.response?.status === 404) {
                errorMessage = 'PDF não encontrado';
            } else if (err?.response?.status === 401) {
                errorMessage = 'Não autorizado. Faça login novamente.';
            } else if (err?.response?.status === 500) {
                errorMessage = 'Erro no servidor ao carregar PDF';
            } else if (err?.message) {
                errorMessage = err.message;
            } else if (err?.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (onDownload) {
            onDownload();
        }
        onClose();
    };

    return (
        <Dialog 
            open={isOpen} 
            handler={onClose} 
            size="xl"
            placeholder={undefined}
            className="max-h-[90vh]"
        >
            <DialogHeader placeholder={undefined} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Typography variant="h5" color="blue-gray" placeholder={undefined}>
                        {billBeneficiary ? `Boleto - ${billBeneficiary}` : 'Visualizar Boleto'}
                    </Typography>
                </div>
                <div className="flex items-center gap-2">
                    {pdfUrl && (
                        <Button
                            size="sm"
                            variant="outlined"
                            color="blue-gray"
                            className="flex items-center gap-2"
                            onClick={handleDownload}
                            placeholder={undefined}
                        >
                            <DocumentArrowDownIcon className="h-4 w-4" />
                            Baixar
                        </Button>
                    )}
                    <IconButton
                        variant="text"
                        color="blue-gray"
                        onClick={onClose}
                        placeholder={undefined}
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </IconButton>
                </div>
            </DialogHeader>
            <DialogBody placeholder={undefined} className="p-0">
                {loading && (
                    <div className="flex justify-center items-center h-96">
                        <Typography color="gray" placeholder={undefined}>
                            Carregando PDF...
                        </Typography>
                    </div>
                )}
                {error && (
                    <div className="flex justify-center items-center h-96">
                        <Typography color="red" placeholder={undefined}>
                            {error}
                        </Typography>
                    </div>
                )}
                {pdfUrl && !loading && !error && !iframeError && (
                    <iframe
                        src={pdfUrl}
                        className="w-full h-[70vh] border-0"
                        title="Visualizador de PDF"
                        onError={() => {
                            console.error('Erro ao carregar iframe do PDF');
                            setIframeError(true);
                        }}
                        onLoad={() => {
                            setIframeError(false);
                        }}
                    />
                )}
                {iframeError && pdfUrl && (
                    <div className="flex flex-col justify-center items-center h-96 gap-4 p-4">
                        <Typography color="red" placeholder={undefined}>
                            Erro ao exibir PDF no navegador
                        </Typography>
                        <Button
                            variant="outlined"
                            color="blue-gray"
                            onClick={handleDownload}
                            placeholder={undefined}
                        >
                            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                            Baixar PDF
                        </Button>
                    </div>
                )}
            </DialogBody>
        </Dialog>
    );
};

export default PDFViewerModal;

