'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from "@/components/sidebar";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Button,
    Spinner,
    Chip
} from "@material-tailwind/react";
import {
    ChartBarIcon,
    DocumentTextIcon,
    UserGroupIcon,
    CurrencyDollarIcon,
    PlusIcon,
    EyeIcon,
    PencilIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon
} from "@heroicons/react/24/outline";
import { getGeneralStats, getMonthlyStats, type GeneralStats, type MonthlyStats } from '@/services/stats';
import Link from 'next/link';
import toast from 'react-hot-toast';

const Home = () => {
    const router = useRouter();
    const [stats, setStats] = useState<GeneralStats | null>(null);
    const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);

            // Carregar estatísticas gerais (obrigatório)
            const generalStats = await getGeneralStats();
            setStats(generalStats);

            // Tentar carregar estatísticas mensais (opcional)
            try {
                const monthlyData = await getMonthlyStats();
                setMonthlyStats(monthlyData);
            } catch (monthlyError) {
                console.warn('Erro ao carregar estatísticas mensais (não crítico):', monthlyError);
                // Não mostrar toast para erro não crítico
            }
        } catch (error) {
            console.error('Erro ao carregar estatísticas gerais:', error);
            toast.error('Erro ao carregar estatísticas');
        } finally {
            setLoading(false);
        }
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

    if (loading) {
        return (
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 bg-gray-50 p-6 md:p-8 lg:p-12 flex items-center justify-center">
                    <div className="text-center">
                        <Spinner className="h-12 w-12 mx-auto mb-4" />
                        <p className="text-gray-600">Carregando estatísticas...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />

            <main className="flex-1 bg-gray-50 p-6 md:p-8 lg:p-12">
                {/* Page Header */}
                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Dashboard Gastécnica</h1>
                    <p className="text-lg text-gray-600">
                        Visão geral do sistema com estatísticas e atalhos rápidos
                    </p>
                </header>

                {/* Estatísticas Principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white" placeholder={undefined}>
                        <CardBody className="p-6" placeholder={undefined}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography variant="h6" className="text-blue-100" placeholder={undefined}>
                                        Total de Orçamentos
                                    </Typography>
                                    <Typography variant="h3" className="font-bold" placeholder={undefined}>
                                        {stats?.totals.budgets || 0}
                                    </Typography>
                                    <Typography variant="small" className="text-blue-200 mt-1" placeholder={undefined}>
                                        Aprovados: {stats?.status.approvedBudgets || 0} | Pendentes: {stats?.status.pendingBudgets || 0}
                                    </Typography>
                                </div>
                                <DocumentTextIcon className="h-12 w-12 text-blue-200" />
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white" placeholder={undefined}>
                        <CardBody className="p-6" placeholder={undefined}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography variant="h6" className="text-green-100" placeholder={undefined}>
                                        Total de Recibos
                                    </Typography>
                                    <Typography variant="h3" className="font-bold" placeholder={undefined}>
                                        {stats?.totals.receipts || 0}
                                    </Typography>
                                    <Typography variant="small" className="text-green-200 mt-1" placeholder={undefined}>
                                        Pagos: {stats?.status.paidReceipts || 0} | Pendentes: {stats?.status.pendingReceipts || 0}
                                    </Typography>
                                </div>
                                <CurrencyDollarIcon className="h-12 w-12 text-green-200" />
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white" placeholder={undefined}>
                        <CardBody className="p-6" placeholder={undefined}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography variant="h6" className="text-purple-100" placeholder={undefined}>
                                        Total de Clientes
                                    </Typography>
                                    <Typography variant="h3" className="font-bold" placeholder={undefined}>
                                        {stats?.totals.clients || 0}
                                    </Typography>
                                </div>
                                <UserGroupIcon className="h-12 w-12 text-purple-200" />
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white" placeholder={undefined}>
                        <CardBody className="p-6" placeholder={undefined}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <Typography variant="h6" className="text-orange-100" placeholder={undefined}>
                                        Valor Total
                                    </Typography>
                                    <Typography variant="h3" className="font-bold" placeholder={undefined}>
                                        {formatCurrency((stats?.totals.budgetValue || 0) + (stats?.totals.receiptValue || 0))}
                                    </Typography>
                                </div>
                                <ChartBarIcon className="h-12 w-12 text-orange-200" />
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Valores Detalhados */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="p-6" placeholder={undefined}>
                        <Typography variant="h6" color="blue-gray" className="mb-4" placeholder={undefined}>
                            💰 Valores dos Orçamentos
                        </Typography>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Typography variant="small" color="gray" placeholder={undefined}>Aprovados:</Typography>
                                <Typography variant="small" color="green" className="font-semibold" placeholder={undefined}>
                                    {formatCurrency(stats?.values.budgets.approved || 0)}
                                </Typography>
                            </div>
                            <div className="flex justify-between items-center">
                                <Typography variant="small" color="gray" placeholder={undefined}>Pendentes:</Typography>
                                <Typography variant="small" color="orange" className="font-semibold" placeholder={undefined}>
                                    {formatCurrency(stats?.values.budgets.pending || 0)}
                                </Typography>
                            </div>
                            <div className="flex justify-between items-center">
                                <Typography variant="small" color="gray" placeholder={undefined}>Rejeitados:</Typography>
                                <Typography variant="small" color="red" className="font-semibold" placeholder={undefined}>
                                    {formatCurrency(stats?.values.budgets.rejected || 0)}
                                </Typography>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between items-center">
                                <Typography variant="small" color="blue-gray" className="font-semibold" placeholder={undefined}>Total:</Typography>
                                <Typography variant="small" color="blue-gray" className="font-bold" placeholder={undefined}>
                                    {formatCurrency(stats?.values.budgets.total || 0)}
                                </Typography>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6" placeholder={undefined}>
                        <Typography variant="h6" color="blue-gray" className="mb-4" placeholder={undefined}>
                            💳 Valores dos Recibos
                        </Typography>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Typography variant="small" color="gray" placeholder={undefined}>Pagos:</Typography>
                                <Typography variant="small" color="green" className="font-semibold" placeholder={undefined}>
                                    {formatCurrency(stats?.values.receipts.paid || 0)}
                                </Typography>
                            </div>
                            <div className="flex justify-between items-center">
                                <Typography variant="small" color="gray" placeholder={undefined}>A Receber:</Typography>
                                <Typography variant="small" color="orange" className="font-semibold" placeholder={undefined}>
                                    {formatCurrency(stats?.values.receipts.pending || 0)}
                                </Typography>
                            </div>
                            <hr className="my-2" />
                            <div className="flex justify-between items-center">
                                <Typography variant="small" color="blue-gray" className="font-semibold" placeholder={undefined}>Total:</Typography>
                                <Typography variant="small" color="blue-gray" className="font-bold" placeholder={undefined}>
                                    {formatCurrency(stats?.values.receipts.total || 0)}
                                </Typography>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Atalhos Rápidos */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-shadow" placeholder={undefined}>
                        <CardHeader className="bg-blue-50" placeholder={undefined}>
                            <Typography variant="h6" className="text-blue-800" placeholder={undefined}>
                                Orçamento Rápido
                            </Typography>
                        </CardHeader>
                        <CardBody placeholder={undefined}>
                            <p className="text-gray-600 mb-4">Crie um orçamento rapidamente</p>
                            <Button
                                color="blue"
                                className="w-full"
                                onClick={() => router.push('/budget')}
                                placeholder={undefined}
                            >
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Novo Orçamento
                            </Button>
                        </CardBody>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow" placeholder={undefined}>
                        <CardHeader className="bg-green-50" placeholder={undefined}>
                            <Typography variant="h6" className="text-green-800" placeholder={undefined}>
                                Novo Recibo
                            </Typography>
                        </CardHeader>
                        <CardBody placeholder={undefined}>
                            <p className="text-gray-600 mb-4">Gere um recibo rapidamente</p>
                            <Button
                                color="green"
                                className="w-full"
                                onClick={() => router.push('/receipts/new')}
                                placeholder={undefined}
                            >
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Novo Recibo
                            </Button>
                        </CardBody>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow" placeholder={undefined}>
                        <CardHeader className="bg-purple-50" placeholder={undefined}>
                            <Typography variant="h6" className="text-purple-800" placeholder={undefined}>
                                Novo Cliente
                            </Typography>
                        </CardHeader>
                        <CardBody placeholder={undefined}>
                            <p className="text-gray-600 mb-4">Cadastre um novo cliente</p>
                            <Button
                                color="purple"
                                className="w-full"
                                onClick={() => router.push('/clients/new')}
                                placeholder={undefined}
                            >
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Novo Cliente
                            </Button>
                        </CardBody>
                    </Card>
                </div>

                {/* Status e Atividades Recentes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Status */}
                    <Card placeholder={undefined}>
                        <CardHeader placeholder={undefined}>
                            <Typography variant="h6" placeholder={undefined}>
                                Status dos Documentos
                            </Typography>
                        </CardHeader>
                        <CardBody placeholder={undefined}>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Orçamentos Aprovados</span>
                                    </div>
                                    <Chip value={stats?.status.approvedBudgets || 0} color="green" size="sm" placeholder={undefined} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <ClockIcon className="h-5 w-5 text-yellow-500 mr-2" />
                                        <span>Orçamentos Pendentes</span>
                                    </div>
                                    <Chip value={stats?.status.pendingBudgets || 0} color="yellow" size="sm" placeholder={undefined} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                                        <span>Recibos Pagos</span>
                                    </div>
                                    <Chip value={stats?.status.paidReceipts || 0} color="green" size="sm" placeholder={undefined} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <ClockIcon className="h-5 w-5 text-yellow-500 mr-2" />
                                        <span>Recibos Pendentes</span>
                                    </div>
                                    <Chip value={stats?.status.pendingReceipts || 0} color="yellow" size="sm" placeholder={undefined} />
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Atividades Recentes */}
                    <Card placeholder={undefined}>
                        <CardHeader placeholder={undefined}>
                            <Typography variant="h6" placeholder={undefined}>
                                Atividades Recentes
                            </Typography>
                        </CardHeader>
                        <CardBody placeholder={undefined}>
                            <div className="space-y-3">
                                {stats?.recent.budgets.slice(0, 3).map((budget, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <div>
                                            <p className="font-medium text-sm">{budget.clientName}</p>
                                            <p className="text-xs text-gray-500">{formatDate(budget.createdAt)}</p>
                                        </div>
                                        <div className="flex space-x-1">
                                            <Button
                                                size="sm"
                                                variant="text"
                                                color="blue"
                                                onClick={() => router.push(`/budget?id=${budget.id}`)}
                                                placeholder={undefined}
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="text"
                                                color="green"
                                                onClick={() => router.push(`/budget-list`)}
                                                placeholder={undefined}
                                            >
                                                <EyeIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {stats?.recent.budgets.length === 0 && (
                                    <p className="text-gray-500 text-center py-4">Nenhuma atividade recente</p>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default Home;
