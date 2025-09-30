"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  getReceipts,
  deleteReceipt,
  generateReceiptPDF,
  sendReceiptPDFByEmail,
  Receipt
} from '@/services/receipt';
import { getClients, Client } from '@/services/client';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  EnvelopeIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '@/components/ConfirmationModal';
import ReceiptEmailModal from '@/components/ReceiptEmailModal';
import Sidebar from '@/components/sidebar';
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Tooltip,
  Spinner,
} from "@material-tailwind/react";
import Link from 'next/link';

const TABLE_HEAD = ["Cliente", "Descrição", "Valor", "Status", "Data", "Ações"];

export default function ReceiptsPage() {
  const router = useRouter();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [mounted, setMounted] = useState(false);

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'pending', label: 'Pendente' },
    { value: 'paid', label: 'Pago' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  const loadReceipts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getReceipts(currentPage, 10, clientFilter || undefined, statusFilter || undefined);
      setReceipts(response.receipts);
      setTotalPages(response.pagination.totalPages);
      setTotal(response.pagination.total);
    } catch (error) {
      console.error('Erro ao carregar recibos:', error);
      toast.error('Erro ao carregar recibos');
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter, clientFilter]);

  const loadClients = useCallback(async () => {
    try {
      const response = await getClients(1, 100);
      setClients(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadReceipts();
      loadClients();
    }
  }, [mounted, loadReceipts, loadClients]);

  const handleDelete = async (receipt: Receipt) => {
    try {
      await deleteReceipt(receipt.id!);
      toast.success('Recibo deletado com sucesso');
      loadReceipts();
    } catch (error) {
      console.error('Erro ao deletar recibo:', error);
      toast.error('Erro ao deletar recibo');
    }
    setShowDeleteModal(false);
    setSelectedReceipt(null);
  };

  const handleGeneratePDF = async (receipt: Receipt) => {
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
    if (!selectedReceipt) return;

    try {
      await sendReceiptPDFByEmail(selectedReceipt.id!, email, customMessage);
      toast.success('Email enviado com sucesso');
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast.error('Erro ao enviar email');
    }
    setShowEmailModal(false);
    setSelectedReceipt(null);
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

  const filteredReceipts = receipts.filter(receipt =>
    receipt.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    receipt.clientCnpj.includes(searchTerm) ||
    receipt.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Card className="h-full w-full p-4" placeholder={undefined}>
        <CardHeader floated={false} shadow={false} className="rounded-none" placeholder={undefined}>
          <div className="mb-8 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray" placeholder={undefined}>
                Lista de Recibos
              </Typography>
              <Typography color="gray" className="mt-1 font-normal" placeholder={undefined}>
                Gerencie todos os recibos
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button className="flex items-center gap-3 bg-custom-blue" size="sm" placeholder={undefined}>
                <Link className="flex items-center gap-3" href={'/receipts/new'}>
                  <PlusIcon className="h-4 w-4" />
                  Adicionar Novo
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="w-full md:w-72">
              <Input
                label="Buscar"
                crossOrigin={undefined}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={clientFilter}
                onChange={(e) => setClientFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os clientes</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-scroll px-0" placeholder={undefined}>
          {!mounted || loading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner className="h-8 w-8" />
              <span className="ml-2">Carregando recibos...</span>
            </div>
          ) : filteredReceipts.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <Typography variant="h6" color="gray" placeholder={undefined}>
                Nenhum recibo encontrado
              </Typography>
            </div>
          ) : (
            <table className="mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head) => (
                    <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                      <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70" placeholder={undefined}>
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredReceipts.map((receipt, index) => {
                  const isLast = index === filteredReceipts.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={receipt.id}>
                      <td className={classes}>
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                            {receipt.clientName}
                          </Typography>
                          <Typography variant="small" color="gray" className="font-normal" placeholder={undefined}>
                            {receipt.clientCnpj}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal max-w-xs truncate" placeholder={undefined}>
                          {receipt.description}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal font-semibold" placeholder={undefined}>
                          {formatCurrency(receipt.amount)}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(receipt.status)}`}>
                          {getStatusLabel(receipt.status)}
                        </span>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                          {receipt.createdAt ? formatDate(receipt.createdAt) : '-'}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <div className="flex space-x-2">
                          <Tooltip content="Visualizar">
                            <IconButton
                              variant="text"
                              color="blue-gray"
                              onClick={() => router.push(`/receipts/${receipt.id}`)}
                              placeholder={undefined}
                            >
                              <EyeIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Editar">
                            <IconButton
                              variant="text"
                              color="blue-gray"
                              onClick={() => router.push(`/receipts/edit/${receipt.id}`)}
                              placeholder={undefined}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Gerar PDF">
                            <IconButton
                              variant="text"
                              color="green"
                              onClick={() => handleGeneratePDF(receipt)}
                              placeholder={undefined}
                            >
                              <DocumentArrowDownIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Enviar por Email">
                            <IconButton
                              variant="text"
                              color="purple"
                              onClick={() => {
                                setSelectedReceipt(receipt);
                                setShowEmailModal(true);
                              }}
                              placeholder={undefined}
                            >
                              <EnvelopeIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip content="Deletar">
                            <IconButton
                              variant="text"
                              color="red"
                              onClick={() => {
                                setSelectedReceipt(receipt);
                                setShowDeleteModal(true);
                              }}
                              placeholder={undefined}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4" placeholder={undefined}>
          <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
            Total: {filteredReceipts.length} recibos
          </Typography>
          <div className="flex items-center gap-2">
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              placeholder={undefined}
            >
              Anterior
            </Button>
            <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
              Página {currentPage} de {totalPages}
            </Typography>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              placeholder={undefined}
            >
              Próxima
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Modais */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedReceipt(null);
        }}
        onConfirm={() => selectedReceipt && handleDelete(selectedReceipt)}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja deletar este recibo? Esta ação não pode ser desfeita."
      />

      <ReceiptEmailModal
        isOpen={showEmailModal}
        onClose={() => {
          setShowEmailModal(false);
          setSelectedReceipt(null);
        }}
        onSend={handleSendEmail}
        title="Enviar Recibo por Email"
        defaultEmail={selectedReceipt?.clientEmail || ''}
      />
    </div>
  );
}