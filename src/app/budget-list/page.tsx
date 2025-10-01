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
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Spinner,
} from "@material-tailwind/react";
import { PencilIcon, EyeIcon, TrashIcon, EnvelopeIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { getBudgets, deleteBudget, generateBudgetPDF, Budget } from "@/services/budget";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ConfirmationModal";
import DetailsModal from "@/components/DetailsModal";
import EmailModal from "@/components/EmailModal";
import BudgetSignatureValidator from "@/components/BudgetSignatureValidator";
import {
    UserIcon,
    BuildingOfficeIcon,
    PhoneIcon,
    MapPinIcon,
    CalendarIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
    TagIcon
} from "@heroicons/react/24/outline";

const TABLE_HEAD = ["ID", "Cliente", "CNPJ", "Email", "Telefone", "Descrição", "Valor", "Status", "Tipo", "Vinculado", "Data de Criação", "Ações"];

const BudgetList = () => {
    const [open, setOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
    const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [budgetForEmail, setBudgetForEmail] = useState<Budget | null>(null);
    const [signatureModalOpen, setSignatureModalOpen] = useState(false);
    const [budgetForSignature, setBudgetForSignature] = useState<Budget | null>(null);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [generatingPDF, setGeneratingPDF] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    const handleOpen = (budget: Budget) => {
        setSelectedBudget(budget);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedBudget(null);
    };

    const handleEmailOpen = (budget: Budget) => {
        setBudgetForEmail(budget);
        setEmailModalOpen(true);
    };

    const handleValidateSignature = (budget: Budget) => {
        setBudgetForSignature(budget);
        setSignatureModalOpen(true);
    };

    const handleEmailClose = () => {
        setEmailModalOpen(false);
        setBudgetForEmail(null);
    };

    const handleDeleteOpen = (budget: Budget) => {
        setBudgetToDelete(budget);
    };

    const handleDeleteClose = () => {
        setBudgetToDelete(null);
    };

    const handleDelete = async () => {
        if (budgetToDelete) {
            try {
                setIsDeleting(true);
                await deleteBudget(budgetToDelete.id!);
                setBudgets(budgets.filter(budget => budget.id !== budgetToDelete.id));
                toast.success('Orçamento excluído com sucesso!');
                handleDeleteClose();
            } catch (error) {
                console.error('Erro ao deletar orçamento:', error);
                toast.error('Erro ao deletar orçamento. Tente novamente.');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const loadBudgets = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getBudgets(currentPage, 10);
            setBudgets(response.data || []);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            console.error('Erro ao carregar orçamentos:', error);
            toast.error('Erro ao carregar orçamentos. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            loadBudgets();
        }
    }, [loadBudgets, mounted]);


    const generatePDF = async (budget: Budget) => {
        try {
            if (!budget.id) {
                toast.error('ID do orçamento não encontrado');
                return;
            }

            setGeneratingPDF(budget.id);

            // Fazer requisição para a API do backend
            const response = await generateBudgetPDF(budget.id);

            // Criar blob a partir da resposta
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
            toast.error('Erro ao gerar PDF. Tente novamente.');
        } finally {
            setGeneratingPDF(null);
        }
    };

    const filteredBudgets = budgets.filter(budget =>
        budget.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        budget.clientCnpj?.includes(searchTerm) ||
        budget.clientEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <Card className="h-full w-full p-4" placeholder={undefined} >
                <CardHeader floated={false} shadow={false} className="rounded-none" placeholder={undefined}  >
                    <div className="mb-8 flex items-center justify-between gap-8">
                        <div>
                            <Typography variant="h5" color="blue-gray" placeholder={undefined} >
                                Lista de Orçamentos
                            </Typography>
                            <Typography color="gray" className="mt-1 font-normal" placeholder={undefined} >
                                Veja informações sobre todos os orçamentos
                            </Typography>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                            <Button className="flex items-center gap-3 bg-custom-blue" size="sm" placeholder={undefined}  >
                                <Link className="flex items-center gap-3" href={'/budget'}>Adicionar Novo</Link>
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
                    </div>
                </CardHeader>
                <CardBody className="overflow-scroll px-0" placeholder={undefined}  >
                    {!mounted || loading ? (
                        <div className="flex justify-center items-center py-8">
                            <Spinner className="h-8 w-8" />
                            <span className="ml-2">Carregando orçamentos...</span>
                        </div>
                    ) : filteredBudgets.length === 0 ? (
                        <div className="flex justify-center items-center py-8">
                            <Typography variant="h6" color="gray" placeholder={undefined}>
                                Nenhum orçamento encontrado
                            </Typography>
                        </div>
                    ) : (
                        <table className="mt-4 w-full min-w-max table-auto text-left">
                            <thead>
                                <tr>
                                    {TABLE_HEAD.map((head) => (
                                        <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                            <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70" placeholder={undefined}  >
                                                {head}
                                            </Typography>
                                        </th>
                                    ))}
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
                                                <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined} >
                                                    {budget.id?.substring(0, 8)}...
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex flex-col">
                                                    <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined} >
                                                        {budget.clientName}
                                                    </Typography>
                                                    {budget.client && (
                                                        <Chip
                                                            variant="ghost"
                                                            size="sm"
                                                            value="Vinculado"
                                                            color="green"
                                                            className="w-fit mt-1"
                                                            placeholder={undefined}
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined} >
                                                    {budget.clientCnpj}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined} >
                                                    {budget.clientEmail}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined} >
                                                    {budget.clientPhone}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined} >
                                                    {budget.description?.substring(0, 30)}...
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined} >
                                                    R$ {parseFloat(budget.amount || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Chip
                                                    variant="ghost"
                                                    size="sm"
                                                    value={budget.status === 'approved' ? 'Aprovado' : budget.status === 'rejected' ? 'Rejeitado' : 'Pendente'}
                                                    color={budget.status === 'approved' ? "green" : budget.status === 'rejected' ? "red" : "blue-gray"}
                                                    className="w-20"
                                                />
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined} >
                                                    {budget.type === 'avulso' ? 'Avulso' : 'Contrato'}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Chip
                                                    variant="ghost"
                                                    size="sm"
                                                    value={budget.client ? 'Sim' : 'Não'}
                                                    color={budget.client ? "green" : "blue-gray"}
                                                    className="w-fit"
                                                    placeholder={undefined}
                                                />
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined} >
                                                    {budget.createdAt ? new Date(budget.createdAt).toLocaleDateString('pt-BR') : '-'}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex space-x-2">
                                                    <Tooltip content="Editar Orçamento">
                                                        <IconButton
                                                            variant="text"
                                                            color="blue-gray"
                                                            placeholder={undefined}
                                                            onClick={() => window.location.href = `/budget?id=${budget.id}`}
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip content="Ver Completo">
                                                        <IconButton
                                                            variant="text"
                                                            color="blue-gray"
                                                            onClick={() => handleOpen(budget)}
                                                            placeholder={undefined}
                                                        >
                                                            <EyeIcon className="h-5 w-5" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip content="Gerar PDF">
                                                        <IconButton
                                                            variant="text"
                                                            color="blue-gray"
                                                            placeholder={undefined}
                                                            onClick={() => generatePDF(budget)}
                                                            disabled={generatingPDF === budget.id}
                                                        >
                                                            {generatingPDF === budget.id ? (
                                                                <Spinner className="h-5 w-5" />
                                                            ) : (
                                                                <DocumentTextIcon className="h-5 w-5" />
                                                            )}
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip content="Enviar por Email">
                                                        <IconButton
                                                            variant="text"
                                                            color="blue"
                                                            onClick={() => handleEmailOpen(budget)}
                                                            placeholder={undefined}
                                                        >
                                                            <EnvelopeIcon className="h-5 w-5" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {budget.digitalSignature && (
                                                        <Tooltip content="Validar Assinatura Digital">
                                                            <IconButton
                                                                variant="text"
                                                                color="green"
                                                                onClick={() => handleValidateSignature(budget)}
                                                                placeholder={undefined}
                                                            >
                                                                <ShieldCheckIcon className="h-5 w-5" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    <Tooltip content="Apagar Orçamento">
                                                        <IconButton
                                                            variant="text"
                                                            color="red"
                                                            onClick={() => handleDeleteOpen(budget)}
                                                            placeholder={undefined}
                                                        >
                                                            <TrashIcon className="h-5 w-5" />
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
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4" placeholder={undefined} >
                    <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                        Total: {filteredBudgets.length} orçamentos
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


            <DetailsModal
                isOpen={open}
                onClose={handleClose}
                title={selectedBudget?.clientName || 'Orçamento'}
                subtitle="Informações completas do orçamento"
                type="budget"
                details={selectedBudget ? [
                    {
                        label: 'ID do Orçamento',
                        value: selectedBudget.id,
                        icon: <DocumentTextIcon className="h-5 w-5 text-gray-500" />,
                        type: 'text'
                    },
                    {
                        label: 'Cliente',
                        value: selectedBudget.clientName,
                        icon: <UserIcon className="h-5 w-5 text-blue-500" />,
                        type: 'text'
                    },
                    {
                        label: 'CNPJ',
                        value: selectedBudget.clientCnpj,
                        icon: <BuildingOfficeIcon className="h-5 w-5 text-green-500" />,
                        type: 'text'
                    },
                    {
                        label: 'Email',
                        value: selectedBudget.clientEmail,
                        icon: <EnvelopeIcon className="h-5 w-5 text-purple-500" />,
                        type: 'email'
                    },
                    {
                        label: 'Telefone',
                        value: selectedBudget.clientPhone,
                        icon: <PhoneIcon className="h-5 w-5 text-orange-500" />,
                        type: 'phone'
                    },
                    {
                        label: 'Descrição',
                        value: selectedBudget.description,
                        icon: <DocumentTextIcon className="h-5 w-5 text-indigo-500" />,
                        type: 'text'
                    },
                    {
                        label: 'Valor',
                        value: selectedBudget.amount,
                        icon: <CurrencyDollarIcon className="h-5 w-5 text-green-600" />,
                        type: 'currency'
                    },
                    {
                        label: 'Status',
                        value: selectedBudget.status,
                        icon: <TagIcon className="h-5 w-5 text-red-500" />,
                        type: 'status'
                    },
                    {
                        label: 'Tipo',
                        value: selectedBudget.type,
                        icon: <TagIcon className="h-5 w-5 text-teal-500" />,
                        type: 'status'
                    },
                    {
                        label: 'Vinculado ao Cliente',
                        value: selectedBudget.client ? 'Sim' : 'Não',
                        icon: <UserIcon className="h-5 w-5 text-cyan-500" />,
                        type: 'status'
                    },
                    ...(selectedBudget.client ? [{
                        label: 'ID do Cliente Vinculado',
                        value: selectedBudget.client.id,
                        icon: <BuildingOfficeIcon className="h-5 w-5 text-cyan-500" />,
                        type: 'text'
                    }] : []),
                    {
                        label: 'Data de Criação',
                        value: selectedBudget.createdAt,
                        icon: <CalendarIcon className="h-5 w-5 text-pink-500" />,
                        type: 'date'
                    }
                ] : []}
            />


            <ConfirmationModal
                isOpen={!!budgetToDelete}
                onClose={handleDeleteClose}
                onConfirm={handleDelete}
                title="Confirmar Exclusão"
                message={`Tem certeza de que deseja excluir o orçamento do cliente "${budgetToDelete?.clientName}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                cancelText="Cancelar"
                isLoading={isDeleting}
                type="danger"
            />

            <EmailModal
                isOpen={emailModalOpen}
                onClose={handleEmailClose}
                budgetId={budgetForEmail?.id || ''}
                clientName={budgetForEmail?.clientName || ''}
                clientEmail={budgetForEmail?.clientEmail}
            />

            <BudgetSignatureValidator
                isOpen={signatureModalOpen}
                onClose={() => setSignatureModalOpen(false)}
                budgetId={budgetForSignature?.id || ''}
                budgetTitle={budgetForSignature?.clientName || 'Orçamento'}
            />
        </div>
    );
};

export default BudgetList;
