"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getReceiptById, generateReceiptPDF, sendReceiptPDFByEmail, Receipt } from '@/services/receipt';
import { toast } from 'react-hot-toast';
import {
    ArrowLeftIcon,
    PencilIcon,
    DocumentArrowDownIcon,
    EnvelopeIcon,
    TrashIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import ConfirmationModal from '@/components/ConfirmationModal';
import EmailModal from '@/components/EmailModal';
import SignatureValidator from '@/components/SignatureValidator';

export default function ReceiptDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const [receipt, setReceipt] = useState<Receipt | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showSignatureValidator, setShowSignatureValidator] = useState(false);

    useEffect(() => {
        if (params.id) {
            loadReceipt();
        }
    }, [params.id]);

    const loadReceipt = async () => {
        try {
            setLoading(true);
            const data = await getReceiptById(params.id as string);
            setReceipt(data);
        } catch (error) {
            console.error('Erro ao carregar recibo:', error);
            toast.error('Erro ao carregar recibo');
            router.push('/receipts');
        } finally {
            setLoading(false);
        }
    };

    const handleGeneratePDF = async () => {
        if (!receipt) return;

        try {
            const pdfBlob = await generateReceiptPDF(receipt.id!);
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `recibo-${receipt.id?.substring(0, 8)}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('PDF gerado com sucesso');
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            toast.error('Erro ao gerar PDF');
        }
    };

    const handleSendEmail = async (email: string, customMessage?: string) => {
        if (!receipt) return;

        try {
            await sendReceiptPDFByEmail(receipt.id!, email, customMessage);
            toast.success('Email enviado com sucesso');
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            toast.error('Erro ao enviar email');
        }
        setShowEmailModal(false);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'paid':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Pendente';
            case 'paid':
                return 'Pago';
            case 'cancelled':
                return 'Cancelado';
            default:
                return status;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!receipt) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Recibo não encontrado</h1>
                    <button
                        onClick={() => router.push('/receipts')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Voltar para Recibos
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Voltar
                </button>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Recibo #{receipt.id?.substring(0, 8)}</h1>
                        <p className="text-gray-600">
                            Criado em {receipt.createdAt ? formatDate(receipt.createdAt) : '-'}
                        </p>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => router.push(`/receipts/edit/${receipt.id}`)}
                            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Editar
                        </button>
                        <button
                            onClick={handleGeneratePDF}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                            PDF
                        </button>
                        <button
                            onClick={() => setShowEmailModal(true)}
                            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                        >
                            <EnvelopeIcon className="h-4 w-4 mr-2" />
                            Email
                        </button>
                        <button
                            onClick={() => setShowSignatureValidator(true)}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <ShieldCheckIcon className="h-4 w-4 mr-2" />
                            Validar Assinatura
                        </button>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            <TrashIcon className="h-4 w-4 mr-2" />
                            Deletar
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informações do Cliente */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Cliente</h2>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Nome</label>
                            <p className="text-sm text-gray-900">{receipt.clientName}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">CNPJ</label>
                            <p className="text-sm text-gray-900">{receipt.clientCnpj}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <p className="text-sm text-gray-900">{receipt.clientEmail}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Telefone</label>
                            <p className="text-sm text-gray-900">{receipt.clientPhone}</p>
                        </div>
                        {receipt.clientAddress && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Endereço</label>
                                <p className="text-sm text-gray-900">{receipt.clientAddress}</p>
                            </div>
                        )}
                        {(receipt.clientCity || receipt.clientState) && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Cidade/Estado</label>
                                <p className="text-sm text-gray-900">
                                    {receipt.clientCity} {receipt.clientState && `- ${receipt.clientState}`}
                                </p>
                            </div>
                        )}
                        {receipt.clientZipCode && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">CEP</label>
                                <p className="text-sm text-gray-900">{receipt.clientZipCode}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detalhes do Recibo */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Recibo</h2>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Status</label>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(receipt.status)}`}>
                                {getStatusLabel(receipt.status)}
                            </span>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Valor</label>
                            <p className="text-lg font-semibold text-gray-900">{formatCurrency(receipt.amount)}</p>
                        </div>
                        {receipt.amountInWords && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Valor por Extenso</label>
                                <p className="text-sm text-gray-900 italic">{receipt.amountInWords}</p>
                            </div>
                        )}
                        <div>
                            <label className="text-sm font-medium text-gray-500">Descrição</label>
                            <p className="text-sm text-gray-900">{receipt.description}</p>
                        </div>
                        {receipt.receiptDate && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Data do Recibo</label>
                                <p className="text-sm text-gray-900">{formatDate(receipt.receiptDate.toString())}</p>
                            </div>
                        )}
                        {receipt.dueDate && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Data de Vencimento</label>
                                <p className="text-sm text-gray-900">{formatDate(receipt.dueDate.toString())}</p>
                            </div>
                        )}
                        {receipt.digitalSignature && (
                            <div>
                                <label className="text-sm font-medium text-gray-500">Assinatura Digital</label>
                                <p className="text-sm text-gray-900">{receipt.digitalSignature}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Informações da Empresa */}
                <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações da Empresa</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Nome</label>
                            <p className="text-sm text-gray-900">GASTÉCNICA</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">CNPJ</label>
                            <p className="text-sm text-gray-900">21.375.657/0001-03</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Email</label>
                            <p className="text-sm text-gray-900">gastecnica2014@hotmail.com.br</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Telefone</label>
                            <p className="text-sm text-gray-900">(84) 9967-2214</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modais */}
            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => {
                    // Implementar delete
                    setShowDeleteModal(false);
                }}
                title="Confirmar Exclusão"
                message="Tem certeza que deseja deletar este recibo? Esta ação não pode ser desfeita."
            />

            <EmailModal
                isOpen={showEmailModal}
                onClose={() => setShowEmailModal(false)}
                onSend={handleSendEmail}
                title="Enviar Recibo por Email"
                defaultEmail={receipt.clientEmail}
            />

            <SignatureValidator
                isOpen={showSignatureValidator}
                onClose={() => setShowSignatureValidator(false)}
                receiptId={receipt.id || ''}
                receiptTitle={`Recibo ${receipt.id?.substring(0, 8).toUpperCase()}`}
            />
        </div>
    );
}
