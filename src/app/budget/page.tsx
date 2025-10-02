'use client';

import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, Textarea, Button, Select, Option, Spinner } from '@material-tailwind/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Sidebar from '@/components/sidebar';
import { schema } from './schema';
import InputMask from '@/components/inputMask';
import { createBudget, getBudgetById, updateBudget, updateBudgetSignature, type Budget } from '@/services/budget';
import { getClients, type Client } from '@/services/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

type ItemField = 'description' | 'quantity' | 'unitPrice' | 'total';



const Budget = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const budgetId = searchParams.get('id');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [budgetType, setBudgetType] = useState<'avulso' | 'contract'>('avulso');

    const { control, handleSubmit, register, setValue, getValues, formState: { errors }, reset, watch } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            clientName: '',
            clientCnpj: '',
            clientEmail: '',
            clientPhone: '',
            clientStreet: '',
            clientNumber: '',
            clientNeighborhood: '',
            clientZipCode: '',
            description: '',
            amount: 0,
            status: 'pending',
            type: 'avulso',
            items: [{ description: '', quantity: 0, unitPrice: null, total: 0 }],
            digitalSignature: '',
            signatureHash: '',
            certificateId: '',
            signatureTimestamp: null,
            signatureValidUntil: null,
            validationQRCode: '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });

    // Observar mudanças nos itens para calcular o total automaticamente
    const watchedItems = watch('items');

    // Calcular valor total automaticamente - versão otimizada
    useEffect(() => {
        if (watchedItems && Array.isArray(watchedItems)) {
            const totalAmount = watchedItems.reduce((sum: number, item: any) => {
                const quantity = Number(item.quantity) || 0;
                const unitPrice = Number(item.unitPrice) || 0;
                return sum + (quantity * unitPrice);
            }, 0);
            setValue('amount', totalAmount, { shouldValidate: true, shouldDirty: true });
        }
    }, [watchedItems, setValue]);

    // Função para calcular total em tempo real
    const calculateTotalAmount = () => {
        const allItems = getValues('items');
        if (allItems && Array.isArray(allItems)) {
            const totalAmount = allItems.reduce((sum: number, item: any) => {
                const quantity = Number(item.quantity) || 0;
                const unitPrice = Number(item.unitPrice) || 0;
                return sum + (quantity * unitPrice);
            }, 0);
            setValue('amount', totalAmount, { shouldValidate: true, shouldDirty: true });
        }
    };

    // Carregar clientes
    useEffect(() => {
        const loadClients = async () => {
            try {
                const response = await getClients(1, 100); // Buscar todos os clientes
                setClients(response.data);
            } catch (error) {
                console.error('Erro ao carregar clientes:', error);
                toast.error('Erro ao carregar lista de clientes');
            }
        };
        loadClients();
    }, []);

    // Limpar campos quando o tipo mudar
    useEffect(() => {
        if (budgetType === 'avulso') {
            // Para avulso, limpar seleção de cliente
            setSelectedClient(null);
            setValue('clientId', '');
        } else if (budgetType === 'contract') {
            // Para contrato, limpar campos manuais
            setValue('clientName', '');
            setValue('clientCnpj', '');
            setValue('clientEmail', '');
            setValue('clientPhone', '');
            setValue('clientStreet', '');
            setValue('clientNumber', '');
            setValue('clientNeighborhood', '');
            setValue('clientZipCode', '');
        }
    }, [budgetType, setValue]);

    const loadBudgetData = useCallback(async () => {
        if (!budgetId) return;

        try {
            setIsLoading(true);
            const budget = await getBudgetById(budgetId);
            console.log('Budget loaded:', budget);
            // Definir o tipo do orçamento
            setBudgetType(budget.type || 'avulso');

            // Se for contrato e tiver cliente vinculado, selecionar o cliente
            if (budget.type === 'contract' && budget.client) {
                const client = clients.find(c => c.id === budget.client.id);
                if (client) {
                    setSelectedClient(client);
                }
            }

            // Preencher o formulário com os dados do orçamento
            reset({
                clientName: budget.clientName || '',
                clientCnpj: budget.clientCnpj || '',
                clientEmail: budget.clientEmail || '',
                clientPhone: budget.clientPhone || '',
                description: budget.description || '',
                amount: budget.amount || '',
                status: budget.status || 'pending',
                type: budget.type || 'avulso',
                clientId: budget.client?.id || '',
                items: budget.items?.length > 0 ? budget.items : [{ description: '', quantity: 0, unitPrice: null, total: 0 }],
                digitalSignature: budget.digitalSignature || '',
                signatureHash: budget.signatureHash || '',
                certificateId: budget.certificateId || '',
                signatureTimestamp: budget.signatureTimestamp || null,
                signatureValidUntil: budget.signatureValidUntil || null,
                validationQRCode: budget.validationQRCode || '',
            });
        } catch (error) {
            console.error('Erro ao carregar orçamento:', error);
            toast.error('Erro ao carregar dados do orçamento');
        } finally {
            setIsLoading(false);
        }
    }, [budgetId, clients, reset]);

    // Carregar dados do orçamento se estiver editando
    useEffect(() => {
        if (budgetId) {
            setIsEditMode(true);

            // Carregar dados diretamente aqui em vez de chamar loadBudgetData
            const loadData = async () => {
                try {
                    setIsLoading(true);
                    const budget = await getBudgetById(budgetId);

                    // Definir o tipo do orçamento
                    setBudgetType(budget.type || 'avulso');

                    // Se for contrato e tiver cliente vinculado, selecionar o cliente
                    if (budget.type === 'contract' && budget.client && clients.length > 0) {
                        const client = clients.find(c => c.id === budget.client.id);
                        if (client) {
                            setSelectedClient(client);
                        }
                    }

                    // Preencher o formulário com os dados do orçamento
                    reset({
                        clientName: budget.clientName || '',
                        clientCnpj: budget.clientCnpj || '',
                        clientEmail: budget.clientEmail || '',
                        clientPhone: budget.clientPhone || '',
                        clientStreet: budget.clientStreet || '',
                        clientNumber: budget.clientNumber || '',
                        clientNeighborhood: budget.clientNeighborhood || '',
                        clientZipCode: budget.clientZipCode || '',
                        description: budget.description || '',
                        amount: budget.amount || '',
                        status: budget.status || 'pending',
                        type: budget.type || 'avulso',
                        clientId: budget.client?.id || '',
                        items: budget.items?.length > 0 ? budget.items : [{ description: '', quantity: 0, unitPrice: null, total: 0 }],
                        digitalSignature: budget.digitalSignature || '',
                        signatureHash: budget.signatureHash || '',
                        certificateId: budget.certificateId || '',
                        signatureTimestamp: budget.signatureTimestamp || null,
                        signatureValidUntil: budget.signatureValidUntil || null,
                        validationQRCode: budget.validationQRCode || '',
                    });
                } catch (error) {
                    console.error('Erro ao carregar orçamento:', error);
                    toast.error('Erro ao carregar dados do orçamento');
                } finally {
                    setIsLoading(false);
                }
            };

            loadData();
        }
    }, [budgetId, clients, reset]);



    // Função removida - cálculo agora é feito diretamente no useEffect e handleChange

    const handleTypeChange = (type: 'avulso' | 'contract') => {
        setBudgetType(type);
        setValue('type', type);

        // Limpar todos os campos de cliente
        setValue('clientName', '');
        setValue('clientCnpj', '');
        setValue('clientEmail', '');
        setValue('clientPhone', '');
        setValue('clientStreet', '');
        setValue('clientNumber', '');
        setValue('clientNeighborhood', '');
        setValue('clientZipCode', '');
        setValue('clientId', '');
        setSelectedClient(null);

        // Forçar revalidação do formulário
        setTimeout(() => {
            // Trigger validation to clear any error messages
            const formValues = getValues();
            reset(formValues);
        }, 100);
    };

    const handleClientSelect = (clientId: string) => {
        if (!clientId) {
            // Se nenhum cliente foi selecionado, limpar tudo
            setSelectedClient(null);
            setValue('clientId', '');
            setValue('clientName', '');
            setValue('clientCnpj', '');
            setValue('clientEmail', '');
            setValue('clientPhone', '');
            setValue('clientStreet', '');
            setValue('clientNumber', '');
            setValue('clientNeighborhood', '');
            setValue('clientZipCode', '');
            return;
        }

        const client = clients.find(c => c.id === clientId);
        if (client) {
            setSelectedClient(client);
            setValue('clientId', clientId);
            // Preencher campos de cliente automaticamente
            setValue('clientName', client.name);
            setValue('clientCnpj', client.cnpj);
            setValue('clientEmail', client.email);
            setValue('clientPhone', client.phone);
            setValue('clientStreet', client.street || '');
            setValue('clientNumber', client.number || '');
            setValue('clientNeighborhood', client.neighborhood || '');
            setValue('clientZipCode', client.zipCode || '');
        }
    };

    const handleChange = (index: number, field: ItemField, value: string | number) => {
        setValue(`items.${index}.${field}`, value, { shouldValidate: true, shouldDirty: true });

        if (field === 'quantity' || field === 'unitPrice') {
            // Usar o valor atualizado diretamente
            const currentQuantity = field === 'quantity' ? Number(value) : getValues(`items.${index}.quantity`) || 0;
            const currentUnitPrice = field === 'unitPrice' ? Number(value) : getValues(`items.${index}.unitPrice`) || 0;

            // Calcular total do item imediatamente
            const itemTotal = currentQuantity * currentUnitPrice;
            setValue(`items.${index}.total`, itemTotal, { shouldValidate: true, shouldDirty: true });

            // Recalcular total geral imediatamente
            calculateTotalAmount();
        }
    };

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            // Preparar dados do orçamento
            let budgetData = {
                ...data,
                amount: data.amount.toString(),
                clientCnpj: data.clientCnpj.replace(/[^0-9]/g, ''),
                clientPhone: data.clientPhone.replace(/[^0-9]/g, ''),
                items: data.items.map((item: any) => ({
                    ...item,
                    total: item.quantity * (item.unitPrice || 0)
                }))
            };



            // Se for contrato e tiver cliente selecionado, incluir dados do cliente
            if (data.type === 'contract' && selectedClient) {
                budgetData.clientId = selectedClient.id;
                // Garantir que os dados do cliente sejam enviados (limpar máscaras)
                budgetData.clientName = selectedClient.name;
                budgetData.clientCnpj = selectedClient.cnpj.replace(/[^0-9]/g, '');
                budgetData.clientEmail = selectedClient.email;
                budgetData.clientPhone = selectedClient.phone.replace(/[^0-9]/g, '');

            }

            let savedBudget;
            if (isEditMode && budgetId) {
                savedBudget = await updateBudget(budgetId, budgetData);
                toast.success('Orçamento atualizado com sucesso!');
            } else {
                savedBudget = await createBudget(budgetData);
                toast.success('Orçamento criado com sucesso!');
            }

            // Se há assinatura digital, chamar API específica de assinatura
            if (data.digitalSignature && data.digitalSignature.trim()) {
                try {
                    console.log('Assinando orçamento:', savedBudget.id);
                    await updateBudgetSignature(savedBudget.id, data.digitalSignature);
                    toast.success('Assinatura digital aplicada com sucesso!');
                } catch (error) {
                    console.error('Erro ao aplicar assinatura:', error);
                    toast.error('Erro ao aplicar assinatura digital');
                }
            }

            router.push('/budget-list');
        } catch (error) {
            console.error('Erro ao salvar orçamento:', error);
            toast.error('Erro ao salvar orçamento. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 bg-gray-50 p-6 md:p-8 lg:p-12 flex items-center justify-center">
                    <div className="text-center">
                        <Spinner className="h-8 w-8 mx-auto mb-4" />
                        <p>Carregando dados do orçamento...</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 bg-gray-50 p-6 md:p-8 lg:p-12">
                <h1 className="text-3xl font-bold text-gray-700 mb-6">
                    {isEditMode ? 'Editar Orçamento' : 'Criar Orçamento'}
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Tipo de Orçamento */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tipo de Orçamento</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            placeholder={undefined}
                                            label="Tipo"
                                            value={field.value || budgetType}
                                            onChange={(value) => {
                                                field.onChange(value);
                                                handleTypeChange(value as 'avulso' | 'contract');
                                            }}
                                        >
                                            <Option value="avulso">Avulso</Option>
                                            <Option value="contract">Contrato</Option>
                                        </Select>
                                    )}
                                />
                                {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Seleção de Cliente para Contratos */}
                    {budgetType === 'contract' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cliente</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Controller
                                        name="clientId"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                placeholder={undefined}
                                                label="Selecionar Cliente"
                                                value={field.value || selectedClient?.id || ''}
                                                onChange={(value) => {
                                                    field.onChange(value);
                                                    handleClientSelect(value || '');
                                                }}
                                            >
                                                {clients.map((client) => (
                                                    <Option key={client.id} value={client.id}>
                                                        {client.name} - {client.cnpj}
                                                    </Option>
                                                ))}
                                            </Select>
                                        )}
                                    />
                                    {errors.clientId && <p className="text-red-500 text-sm">{errors.clientId.message}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Informações do Cliente - Apenas para Avulso */}
                    {budgetType === 'avulso' && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações do Cliente</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Input crossOrigin={undefined} label="Nome do Cliente" {...register('clientName')} />
                                    {errors.clientName && <p className="text-red-500 text-sm">{errors.clientName.message}</p>}
                                </div>
                                <div>
                                    <Controller
                                        name="clientCnpj"
                                        control={control}
                                        render={({ field }) => (
                                            <InputMask
                                                mask={"99.999.999/9999-99"}
                                                {...field}
                                                label="CNPJ do Cliente (Opcional)"
                                                onChange={(e) => field.onChange(e)}
                                                value={field.value}
                                            />
                                        )}
                                    />
                                    {errors.clientCnpj && <p className="text-red-500 text-sm">{errors.clientCnpj.message}</p>}
                                </div>
                                <div>
                                    <Input crossOrigin={undefined} label="Email do Cliente (Opcional)" type="email" {...register('clientEmail')} />
                                    {errors.clientEmail && <p className="text-red-500 text-sm">{errors.clientEmail.message}</p>}
                                </div>
                                <div>
                                    <Controller
                                        name="clientPhone"
                                        control={control}
                                        render={({ field }) => (
                                            <InputMask
                                                mask={"(99) 99999-9999"}
                                                {...field}
                                                label="Telefone do Cliente (Opcional)"
                                                onChange={(e) => field.onChange(e)}
                                                value={field.value}
                                            />
                                        )}
                                    />
                                    {errors.clientPhone && <p className="text-red-500 text-sm">{errors.clientPhone.message}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <Input crossOrigin={undefined} label="Rua (Opcional)" {...register('clientStreet')} />
                                    {errors.clientStreet && <p className="text-red-500 text-sm">{errors.clientStreet.message}</p>}
                                </div>
                                <div>
                                    <Input crossOrigin={undefined} label="Número (Opcional)" {...register('clientNumber')} />
                                    {errors.clientNumber && <p className="text-red-500 text-sm">{errors.clientNumber.message}</p>}
                                </div>
                                <div>
                                    <Input crossOrigin={undefined} label="Bairro (Opcional)" {...register('clientNeighborhood')} />
                                    {errors.clientNeighborhood && <p className="text-red-500 text-sm">{errors.clientNeighborhood.message}</p>}
                                </div>
                                <div>
                                    <Controller
                                        name="clientZipCode"
                                        control={control}
                                        render={({ field }) => (
                                            <InputMask
                                                mask={"99999-999"}
                                                {...field}
                                                label="CEP (Opcional)"
                                                onChange={(e) => field.onChange(e)}
                                                value={field.value}
                                            />
                                        )}
                                    />
                                    {errors.clientZipCode && <p className="text-red-500 text-sm">{errors.clientZipCode.message}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Informações do Cliente Selecionado - Para Contratos */}
                    {budgetType === 'contract' && selectedClient && (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informações do Cliente Selecionado</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Input
                                        crossOrigin={undefined}
                                        label="Nome do Cliente"
                                        value={selectedClient.name}
                                        readOnly
                                        className="bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <Input
                                        crossOrigin={undefined}
                                        label="CNPJ do Cliente"
                                        value={selectedClient.cnpj}
                                        readOnly
                                        className="bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <Input
                                        crossOrigin={undefined}
                                        label="Email do Cliente"
                                        value={selectedClient.email}
                                        readOnly
                                        className="bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <Input
                                        crossOrigin={undefined}
                                        label="Telefone do Cliente"
                                        value={selectedClient.phone}
                                        readOnly
                                        className="bg-gray-100"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                <div>
                                    <Input
                                        crossOrigin={undefined}
                                        label="Rua"
                                        value={selectedClient.street || ''}
                                        readOnly
                                        className="bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <Input
                                        crossOrigin={undefined}
                                        label="Número"
                                        value={selectedClient.number || ''}
                                        readOnly
                                        className="bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <Input
                                        crossOrigin={undefined}
                                        label="Bairro"
                                        value={selectedClient.neighborhood || ''}
                                        readOnly
                                        className="bg-gray-100"
                                    />
                                </div>
                                <div>
                                    <Input
                                        crossOrigin={undefined}
                                        label="CEP"
                                        value={selectedClient.zipCode || ''}
                                        readOnly
                                        className="bg-gray-100"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Textarea label="Descrição" {...register('description')} />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>
                        <div>
                            <Input
                                crossOrigin={undefined}
                                label="Valor Total"
                                type="text"
                                value={`R$ ${(getValues('amount') || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                                readOnly
                                className="bg-gray-100 font-semibold"
                            />
                            <p className="text-sm text-gray-600 mt-1">
                                Valor calculado automaticamente baseado nos itens
                            </p>
                        </div>
                        <div>
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <Select placeholder={undefined} label="Status" {...field}>
                                        <Option value="pending">Pendente</Option>
                                        <Option value="approved">Aprovado</Option>
                                        <Option value="rejected">Rejeitado</Option>
                                    </Select>
                                )}
                            />
                            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-xl font-semibold text-gray-800">Itens</h2>
                            <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-2">
                                <span className="text-sm text-green-700 font-medium">Valor Total: </span>
                                <span className="text-lg font-bold text-green-800">
                                    R$ {(getValues('amount') || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                        {fields.map((item, index) => (
                            <div key={item.id} className="bg-white p-4 rounded shadow-md mb-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <Input
                                            crossOrigin={undefined} label="Descrição do Item"
                                            {...register(`items.${index}.description` as const)} />
                                        {errors.items?.[index]?.description && <p className="text-red-500 text-sm">{errors.items[index].description.message}</p>}
                                    </div>
                                    <div>
                                        <Input
                                            crossOrigin={undefined} label="Quantidade"
                                            type="number"
                                            {...register(`items.${index}.quantity` as const, { valueAsNumber: true })}
                                            onChange={(e) => handleChange(index, 'quantity', +e.target.value)} />
                                        {errors.items?.[index]?.quantity && <p className="text-red-500 text-sm">{errors.items[index].quantity.message}</p>}
                                    </div>
                                    <div>
                                        <Input
                                            crossOrigin={undefined} label="Preço Unitário"
                                            type="number"
                                            {...register(`items.${index}.unitPrice` as const, { valueAsNumber: true })}
                                            onChange={(e) => handleChange(index, 'unitPrice', +e.target.value)} />
                                        {errors.items?.[index]?.unitPrice && <p className="text-red-500 text-sm">{errors.items[index].unitPrice.message}</p>}
                                    </div>
                                    <div>
                                        <Input
                                            label="Total"
                                            type="number"
                                            readOnly
                                            value={Number(getValues(`items.${index}.total`))} crossOrigin={undefined} />
                                    </div>
                                    <div>
                                        <Button
                                            color="red"
                                            onClick={() => {
                                                remove(index);
                                            }}
                                            className="mt-4"
                                            size="sm" placeholder={undefined}                                         >
                                            <TrashIcon className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {fields.length === 0 ? <p className="text-red-500 text-sm">É necessário pelo menos um item </p> : ''}
                        <Button
                            color="blue"
                            onClick={() => {
                                append({ description: '', quantity: 0, unitPrice: null, total: 0 });
                            }}
                            className="mt-4" placeholder={undefined}                        >
                            <div className="flex items-center space-x-2">
                                <PlusIcon className="h-5 w-5" />
                                <span>Adicionar Item</span>
                            </div>
                        </Button>
                    </div>

                    {/* Seção de Assinatura Digital */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Assinatura Digital (Opcional)</h2>
                        <div className="space-y-4">
                            <div>
                                <Textarea
                                    label="Assinatura Digital"
                                    placeholder="Digite sua assinatura digital aqui..."
                                    {...register('digitalSignature')}
                                    rows={3}
                                />
                                <p className="text-sm text-gray-600 mt-1">
                                    Campo opcional para adicionar assinatura digital ao orçamento
                                </p>
                            </div>

                            {/* Mostrar informações de validação se existir assinatura */}
                            {getValues('digitalSignature') && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <h3 className="text-sm font-semibold text-green-800 mb-2">Informações de Validação</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-green-700">Certificado:</span>
                                            <p className="text-green-600">{getValues('certificateId') || 'Não gerado'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-green-700">Data da Assinatura:</span>
                                            <p className="text-green-600">
                                                {getValues('signatureTimestamp')
                                                    ? new Date(getValues('signatureTimestamp')).toLocaleString('pt-BR')
                                                    : 'Não definida'
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-green-700">Válido até:</span>
                                            <p className="text-green-600">
                                                {getValues('signatureValidUntil')
                                                    ? new Date(getValues('signatureValidUntil')).toLocaleString('pt-BR')
                                                    : 'Não definido'
                                                }
                                            </p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-green-700">QR Code:</span>
                                            <p className="text-green-600">{getValues('validationQRCode') ? 'Disponível' : 'Não gerado'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button
                            type="submit"
                            color="green"
                            placeholder={undefined}
                            disabled={isSubmitting}
                            className="flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Spinner className="h-4 w-4" />
                                    {isEditMode ? 'Atualizando...' : 'Criando...'}
                                </>
                            ) : (
                                isEditMode ? 'Atualizar Orçamento' : 'Criar Orçamento'
                            )}
                        </Button>
                    </div>

                </form>
            </main>
        </div>
    );
};

export default Budget;
