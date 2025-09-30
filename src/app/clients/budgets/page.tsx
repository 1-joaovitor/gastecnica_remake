'use client'

import Sidebar from "@/components/sidebar";
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
    Chip,
    Spinner,
} from "@material-tailwind/react";
import { ArrowLeftIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getBudgets, generateBudgetPDF, Budget } from "@/services/budget";
import { getClients, Client } from "@/services/client";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import {
    UserIcon,
    BuildingOfficeIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarIcon,
    CurrencyDollarIcon,
    TagIcon
} from "@heroicons/react/24/outline";

const ClientBudgets = () => {
    const searchParams = useSearchParams();
    const clientId = searchParams.get('id');
    
    const [client, setClient] = useState<Client | null>(null);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const loadClient = async () => {
        if (!clientId) return;
        
        try {
            const response = await getClients(1, 100);
            const foundClient = response.data.find((c: Client) => c.id === clientId);
            if (foundClient) {
                setClient(foundClient);
            }
        } catch (error) {
            console.error('Erro ao carregar cliente:', error);
            toast.error('Erro ao carregar dados do cliente');
        }
    };

    const loadBudgets = async () => {
        if (!clientId) return;
        
        try {
            setLoading(true);
            const response = await getBudgets(currentPage, 10);
            
            // Filtrar apenas orçamentos deste cliente
            const clientBudgets = response.data.filter((budget: Budget) => 
                budget.client && budget.client.id === clientId
            );
            
            setBudgets(clientBudgets);
            setTotalPages(Math.ceil(clientBudgets.length / 10));
        } catch (error) {
            console.error('Erro ao carregar orçamentos:', error);
            toast.error('Erro ao carregar orçamentos do cliente');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (mounted && clientId) {
            loadClient();
            loadBudgets();
        }
    }, [mounted, clientId, currentPage]);

    const generatePDF = async (budget: Budget) => {
        try {
            const response = await generateBudgetPDF(budget.id);
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            
            // Gerar nome do arquivo baseado no cliente e CNPJ
            const clientName = budget.clientName?.replace(/[^a-zA-Z0-9]/g, '_') || 'cliente';
            const clientCnpj = budget.clientCnpj?.replace(/[^0-9]/g, '') || 'sem_cnpj';
            const fileName = `orcamento_${clientName}_${clientCnpj}.pdf`;
            
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(url);
            toast.success('PDF gerado com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            toast.error('Erro ao gerar PDF do orçamento');
        }
    };

    const filteredBudgets = budgets.filter(budget =>
        budget.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        budget.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        budget.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!mounted) {
        return null;
    }

    if (!clientId) {
        return (
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 p-8">
                    <div className="text-center">
                        <Typography variant="h4" color="red" className="mb-4">
                            Cliente não encontrado
                        </Typography>
                        <Link href="/clients">
                            <Button color="blue" placeholder={undefined}>
                                Voltar para Clientes
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex min-h-screen">
                <Sidebar />
                <div className="flex-1 p-8">
                    <div className="flex justify-center items-center h-64">
                        <Spinner className="h-8 w-8" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-8">
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/clients">
                            <IconButton variant="text" color="blue-gray" placeholder={undefined}>
                                <ArrowLeftIcon className="h-5 w-5" />
                            </IconButton>
                        </Link>
                        <div>
                            <Typography variant="h4" color="blue-gray" className="mb-2">
                                Orçamentos do Cliente
                            </Typography>
                            {client && (
                                <Typography variant="lead" color="blue-gray" className="font-normal">
                                    {client.name} - {client.cnpj}
                                </Typography>
                            )}
                        </div>
                    </div>
                </div>

                <Card className="h-full w-full" placeholder={undefined}>
                    <CardHeader floated={false} shadow={false} className="rounded-none" placeholder={undefined}>
                        <div className="mb-8 flex items-center justify-between gap-8">
                            <div>
                                <Typography variant="h5" color="blue-gray" placeholder={undefined}>
                                    Orçamentos Vinculados
                                </Typography>
                                <Typography color="gray" className="mt-1 font-normal" placeholder={undefined}>
                                    {budgets.length} orçamento{budgets.length !== 1 ? 's' : ''} encontrado{budgets.length !== 1 ? 's' : ''}
                                </Typography>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <div className="w-full md:w-72">
                                <Input
                                    label="Buscar orçamentos..."
                                    icon={<DocumentTextIcon className="h-5 w-5" />}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    crossOrigin={undefined}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="overflow-scroll px-0" placeholder={undefined}>
                        {filteredBudgets.length === 0 ? (
                            <div className="text-center py-8">
                                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <Typography variant="h6" color="gray" className="mb-2">
                                    Nenhum orçamento encontrado
                                </Typography>
                                <Typography color="gray" className="font-normal">
                                    Este cliente ainda não possui orçamentos vinculados.
                                </Typography>
                            </div>
                        ) : (
                            <table className="mt-4 w-full min-w-max table-auto text-left">
                                <thead>
                                    <tr>
                                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70" placeholder={undefined}>
                                                ID
                                            </Typography>
                                        </th>
                                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70" placeholder={undefined}>
                                                Descrição
                                            </Typography>
                                        </th>
                                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70" placeholder={undefined}>
                                                Valor
                                            </Typography>
                                        </th>
                                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70" placeholder={undefined}>
                                                Status
                                            </Typography>
                                        </th>
                                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70" placeholder={undefined}>
                                                Data
                                            </Typography>
                                        </th>
                                        <th className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70" placeholder={undefined}>
                                                Ações
                                            </Typography>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBudgets.map((budget, index) => {
                                        const isLast = index === filteredBudgets.length - 1;
                                        const classes = isLast
                                            ? "p-4"
                                            : "p-4 border-b border-blue-gray-50";

                                        return (
                                            <tr key={budget.id}>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                                                        {budget.id?.substring(0, 8)}...
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                                                        {budget.description?.substring(0, 50)}...
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                                                        R$ {parseFloat(budget.amount || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <Chip
                                                        variant="ghost"
                                                        size="sm"
                                                        value={budget.status === 'approved' ? 'Aprovado' : budget.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                                                        color={budget.status === 'approved' ? "green" : budget.status === 'rejected' ? "red" : "blue-gray"}
                                                        className="w-fit"
                                                        placeholder={undefined}
                                                    />
                                                </td>
                                                <td className={classes}>
                                                    <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                                                        {budget.createdAt ? new Date(budget.createdAt).toLocaleDateString('pt-BR') : '-'}
                                                    </Typography>
                                                </td>
                                                <td className={classes}>
                                                    <div className="flex space-x-2">
                                                        <Tooltip content="Gerar PDF">
                                                            <IconButton
                                                                variant="text"
                                                                color="green"
                                                                onClick={() => generatePDF(budget)}
                                                                placeholder={undefined}
                                                            >
                                                                <DocumentTextIcon className="h-5 w-5" />
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
                            Total: {filteredBudgets.length} orçamento{filteredBudgets.length !== 1 ? 's' : ''}
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
            </div>
        </div>
    );
};

export default ClientBudgets;
