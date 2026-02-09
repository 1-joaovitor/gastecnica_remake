"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  getAllBills,
  deleteBill,
  markBillAsPaid,
  downloadBillPDF,
  getBillStats,
  Bill,
  BillStats
} from '@/services/bill';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  DocumentArrowDownIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import ConfirmationModal from '@/components/ConfirmationModal';
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
  Chip,
} from "@material-tailwind/react";

const TABLE_HEAD = ["Beneficiário", "Valor", "Vencimento", "Status", "Ações"];

function getStatusColor(status: string): string {
  switch (status) {
    case 'paid':
      return 'green';
    case 'overdue':
      return 'red';
    case 'pending':
      return 'yellow';
    default:
      return 'gray';
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'paid':
      return 'Pago';
    case 'overdue':
      return 'Vencido';
    case 'pending':
      return 'Pendente';
    default:
      return status;
  }
}

function isDueToday(dueDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due.getTime() === today.getTime();
}

export default function BillsPage() {
  const router = useRouter();
  const [bills, setBills] = useState<Bill[]>([]);
  const [stats, setStats] = useState<BillStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [mounted, setMounted] = useState(false);

  const loadBills = useCallback(async () => {
    try {
      setLoading(true);
      const billsData = await getAllBills();
      setBills(billsData);
    } catch (error: any) {
      console.error('Erro ao carregar boletos:', error);
      toast.error(error?.response?.data?.message || 'Erro ao carregar boletos');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const statsData = await getBillStats();
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      loadBills();
      loadStats();
    }
  }, [mounted, loadBills, loadStats]);

  const handleDelete = async (bill: Bill) => {
    try {
      await deleteBill(bill.id);
      toast.success('Boleto deletado com sucesso');
      loadBills();
      loadStats();
      setShowDeleteModal(false);
      setSelectedBill(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erro ao deletar boleto');
    }
  };

  const handlePay = async (bill: Bill) => {
    try {
      await markBillAsPaid(bill.id);
      toast.success('Boleto marcado como pago');
      loadBills();
      loadStats();
      setShowPayModal(false);
      setSelectedBill(null);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erro ao marcar boleto como pago');
    }
  };

  const handleDownloadPDF = async (bill: Bill) => {
    try {
      if (!bill.hasPDF) {
        toast.error('PDF não disponível para este boleto');
        return;
      }
      const blob = await downloadBillPDF(bill.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `boleto_${bill.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('PDF baixado com sucesso');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Erro ao baixar PDF');
    }
  };

  const filteredBills = bills.filter(bill =>
    bill.beneficiary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <Typography variant="h2" color="blue-gray">
            Boletos
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Gerencie seus boletos e controle de pagamentos
          </Typography>
        </div>

        {/* Estatísticas */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <Typography variant="h6" color="blue-gray">
                Total
              </Typography>
              <Typography variant="h3" color="blue-gray">
                {stats.total}
              </Typography>
            </Card>
            <Card className="p-4">
              <Typography variant="h6" color="blue-gray">
                Pendentes
              </Typography>
              <Typography variant="h3" color="yellow">
                {stats.pending}
              </Typography>
            </Card>
            <Card className="p-4">
              <Typography variant="h6" color="blue-gray">
                Vencidos
              </Typography>
              <Typography variant="h3" color="red">
                {stats.overdue}
              </Typography>
            </Card>
            <Card className="p-4">
              <Typography variant="h6" color="blue-gray">
                A Pagar Hoje
              </Typography>
              <Typography variant="h3" color="orange">
                {stats.dueToday}
              </Typography>
            </Card>
          </div>
        )}

        <Card className="h-full w-full">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="w-full md:w-72">
                <Input
                  label="Buscar por beneficiário"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                className="flex items-center gap-3"
                size="sm"
                onClick={() => router.push('/bills/new')}
              >
                <PlusIcon strokeWidth={2} className="h-4 w-4" />
                Novo Boleto
              </Button>
            </div>
          </CardHeader>
          <CardBody className="overflow-scroll px-0">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spinner className="h-8 w-8" />
              </div>
            ) : filteredBills.length === 0 ? (
              <div className="text-center py-8">
                <Typography color="gray" className="text-lg">
                  Nenhum boleto encontrado
                </Typography>
              </div>
            ) : (
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-gray-100 bg-blue-gray-50/50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold leading-none opacity-70"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBills.map((bill, index) => {
                    const isLast = index === filteredBills.length - 1;
                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
                    const dueToday = isDueToday(bill.dueDate);

                    return (
                      <tr key={bill.id}>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {bill.beneficiary}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography variant="small" color="blue-gray" className="font-normal">
                            {formatCurrency(bill.amount)}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-2">
                            <Typography variant="small" color="blue-gray" className="font-normal">
                              {formatDate(bill.dueDate)}
                            </Typography>
                            {dueToday && bill.status === 'pending' && (
                              <Chip
                                value="Hoje"
                                size="sm"
                                color="orange"
                                className="text-xs"
                              />
                            )}
                          </div>
                        </td>
                        <td className={classes}>
                          <Chip
                            value={getStatusLabel(bill.status)}
                            color={getStatusColor(bill.status) as any}
                            size="sm"
                          />
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-2">
                            {bill.hasPDF && (
                              <Tooltip content="Baixar PDF">
                                <IconButton
                                  variant="text"
                                  color="blue-gray"
                                  onClick={() => handleDownloadPDF(bill)}
                                >
                                  <DocumentArrowDownIcon className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {bill.status !== 'paid' && (
                              <Tooltip content="Marcar como pago">
                                <IconButton
                                  variant="text"
                                  color="green"
                                  onClick={() => {
                                    setSelectedBill(bill);
                                    setShowPayModal(true);
                                  }}
                                >
                                  <CheckCircleIcon className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                            )}
                            <Tooltip content="Deletar">
                              <IconButton
                                variant="text"
                                color="red"
                                onClick={() => {
                                  setSelectedBill(bill);
                                  setShowDeleteModal(true);
                                }}
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
        </Card>

        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedBill(null);
          }}
          onConfirm={() => selectedBill && handleDelete(selectedBill)}
          title="Confirmar exclusão"
          message={`Tem certeza que deseja deletar o boleto de ${selectedBill?.beneficiary}?`}
          type="danger"
        />

        <ConfirmationModal
          isOpen={showPayModal}
          onClose={() => {
            setShowPayModal(false);
            setSelectedBill(null);
          }}
          onConfirm={() => selectedBill && handlePay(selectedBill)}
          title="Marcar como pago"
          message={`Tem certeza que deseja marcar o boleto de ${selectedBill?.beneficiary} como pago? O PDF será removido.`}
          type="warning"
        />
      </div>
    </div>
  );
}

