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
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Spinner,
} from "@material-tailwind/react";
import { PencilIcon, EyeIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { getClients, deleteClient, Client } from "@/services/client";
import toast from "react-hot-toast";
import ConfirmationModal from "@/components/ConfirmationModal";
import DetailsModal from "@/components/DetailsModal";
import {
    UserIcon,
    BuildingOfficeIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    CalendarIcon,
    DocumentTextIcon
} from "@heroicons/react/24/outline";

const TABLE_HEAD = ["Nome", "CNPJ", "Email", "Telefone", "Cidade", "Orçamentos", "Data de Criação", "Ações"];

const ClientsList = () => {
    const [open, setOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [mounted, setMounted] = useState(false);

    const handleOpen = (client: Client) => {
        setSelectedClient(client);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedClient(null);
    };

    const handleDeleteOpen = (client: Client) => {
        setClientToDelete(client);
    };

    const handleDeleteClose = () => {
        setClientToDelete(null);
    };

    const handleDelete = async () => {
        if (clientToDelete) {
            try {
                setIsDeleting(true);
                await deleteClient(clientToDelete.id);
                setClients(clients.filter(client => client.id !== clientToDelete.id));
                toast.success('Cliente excluído com sucesso!');
                handleDeleteClose();
            } catch (error) {
                console.error('Erro ao deletar cliente:', error);
                toast.error('Erro ao deletar cliente. Tente novamente.');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const loadClients = useCallback(async () => {
        try {
            setLoading(true);
            console.log('Iniciando carregamento de clientes...');
            console.log('Página atual:', currentPage);
            const response = await getClients(currentPage, 10);
            console.log('Resposta recebida:', response);
            setClients(response.data || []);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            console.error('Detalhes do erro:', error);
            toast.error('Erro ao carregar clientes. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }, [currentPage]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            console.log('Componente montado, verificando autenticação...');
            // Verificar se há token nos cookies
            if (typeof window !== 'undefined') {
                const token = document.cookie.split(';').find(c => c.trim().startsWith('access-token='));
                console.log('Token nos cookies:', token ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
                if (token) {
                    console.log('Token encontrado:', token.split('=')[1]);
                }
            }
            loadClients();
        }
    }, [loadClients, mounted]);

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.cnpj?.includes(searchTerm) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <Card className="h-full w-full p-4" placeholder={undefined}>
                <CardHeader floated={false} shadow={false} className="rounded-none" placeholder={undefined}>
                    <div className="mb-8 flex items-center justify-between gap-8">
                        <div>
                            <Typography variant="h5" color="blue-gray" placeholder={undefined}>
                                Lista de Clientes
                            </Typography>
                            <Typography color="gray" className="mt-1 font-normal" placeholder={undefined}>
                                Gerencie todos os clientes
                            </Typography>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                            <Button className="flex items-center gap-3 bg-custom-blue" size="sm" placeholder={undefined}>
                                <Link className="flex items-center gap-3" href={'/clients/new'}>
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
                    </div>
                </CardHeader>
                <CardBody className="overflow-scroll px-0" placeholder={undefined}>
                    {!mounted || loading ? (
                        <div className="flex justify-center items-center py-8">
                            <Spinner className="h-8 w-8" />
                            <span className="ml-2">Carregando clientes...</span>
                        </div>
                    ) : filteredClients.length === 0 ? (
                        <div className="flex justify-center items-center py-8">
                            <Typography variant="h6" color="gray" placeholder={undefined}>
                                Nenhum cliente encontrado
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
                                {filteredClients.map((client, index) => {
                                    const isLast = index === filteredClients.length - 1;
                                    const classes = isLast
                                        ? "p-4"
                                        : "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr key={client.id}>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                                                    {client.name}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                                                    {client.cnpj}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                                                    {client.email}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                                                    {client.phone}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                                                    {client.city || '-'}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex items-center gap-2">
                                                    <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                                                        {client.budgets?.length || 0}
                                                    </Typography>
                                                    {client.budgets && client.budgets.length > 0 && (
                                                        <span className="text-xs text-green-600 font-medium">
                                                            orçamento{client.budgets.length > 1 ? 's' : ''}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={classes}>
                                                <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                                                    {client.createdAt ? new Date(client.createdAt).toLocaleDateString('pt-BR') : '-'}
                                                </Typography>
                                            </td>
                                            <td className={classes}>
                                                <div className="flex space-x-2">
                                                    <Tooltip content="Editar Cliente">
                                                        <IconButton
                                                            variant="text"
                                                            color="blue-gray"
                                                            placeholder={undefined}
                                                            onClick={() => window.location.href = `/clients/edit?id=${client.id}`}
                                                        >
                                                            <PencilIcon className="h-5 w-5" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip content="Ver Completo">
                                                        <IconButton
                                                            variant="text"
                                                            color="blue-gray"
                                                            onClick={() => handleOpen(client)}
                                                            placeholder={undefined}
                                                        >
                                                            <EyeIcon className="h-5 w-5" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {client.budgets && client.budgets.length > 0 && (
                                                        <Tooltip content="Ver Orçamentos">
                                                            <IconButton
                                                                variant="text"
                                                                color="green"
                                                                onClick={() => window.location.href = `/clients/budgets?id=${client.id}`}
                                                                placeholder={undefined}
                                                            >
                                                                <DocumentTextIcon className="h-5 w-5" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    <Tooltip content="Apagar Cliente">
                                                        <IconButton
                                                            variant="text"
                                                            color="red"
                                                            onClick={() => handleDeleteOpen(client)}
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
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4" placeholder={undefined}>
                    <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined}>
                        Total: {filteredClients.length} clientes
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
                title={selectedClient?.name || 'Cliente'}
                subtitle="Informações completas do cliente"
                type="client"
                details={selectedClient ? [
                    {
                        label: 'ID',
                        value: selectedClient.id,
                        icon: <BuildingOfficeIcon className="h-5 w-5 text-gray-500" />,
                        type: 'text'
                    },
                    {
                        label: 'CNPJ',
                        value: selectedClient.cnpj,
                        icon: <BuildingOfficeIcon className="h-5 w-5 text-blue-500" />,
                        type: 'text'
                    },
                    {
                        label: 'Email',
                        value: selectedClient.email,
                        icon: <EnvelopeIcon className="h-5 w-5 text-green-500" />,
                        type: 'email'
                    },
                    {
                        label: 'Telefone',
                        value: selectedClient.phone,
                        icon: <PhoneIcon className="h-5 w-5 text-purple-500" />,
                        type: 'phone'
                    },
                    {
                        label: 'Endereço',
                        value: selectedClient.address,
                        icon: <MapPinIcon className="h-5 w-5 text-red-500" />,
                        type: 'text'
                    },
                    {
                        label: 'Cidade',
                        value: selectedClient.city,
                        icon: <MapPinIcon className="h-5 w-5 text-orange-500" />,
                        type: 'text'
                    },
                    {
                        label: 'Estado',
                        value: selectedClient.state,
                        icon: <MapPinIcon className="h-5 w-5 text-indigo-500" />,
                        type: 'text'
                    },
                    {
                        label: 'CEP',
                        value: selectedClient.zipCode,
                        icon: <MapPinIcon className="h-5 w-5 text-pink-500" />,
                        type: 'text'
                    },
                    {
                        label: 'Orçamentos Vinculados',
                        value: selectedClient.budgets?.length || 0,
                        icon: <DocumentTextIcon className="h-5 w-5 text-cyan-500" />,
                        type: 'text'
                    },
                    {
                        label: 'Data de Criação',
                        value: selectedClient.createdAt,
                        icon: <CalendarIcon className="h-5 w-5 text-teal-500" />,
                        type: 'date'
                    }
                ] : []}
            />

            <ConfirmationModal
                isOpen={!!clientToDelete}
                onClose={handleDeleteClose}
                onConfirm={handleDelete}
                title="Confirmar Exclusão"
                message={`Tem certeza de que deseja excluir o cliente "${clientToDelete?.name}"? Esta ação não pode ser desfeita.`}
                confirmText="Excluir"
                cancelText="Cancelar"
                isLoading={isDeleting}
                type="danger"
            />
        </div>
    );
};

export default ClientsList;
