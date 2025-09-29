'use client';

import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, Textarea, Button, Select, Option } from '@material-tailwind/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Sidebar from '@/components/sidebar';
import { schema } from './schema';
import InputMask from '@/components/inputMask';

type ItemField = 'description' | 'quantity' | 'unitPrice' | 'total';



const Budget = () => {
    const { control, handleSubmit, register, setValue, getValues, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            clientName: '',
            clientCnpj: '',
            clientEmail: '',
            clientPhone: '',
            description: '',
            amount: '',
            status: 'pending',
            type: 'contract',
            items: [{ description: '', quantity: 0, unitPrice: null, total: 0 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'items',
    });



    const calculateTotal = (index: number, quantity: number, unitPrice: number) => {

        const total = quantity * unitPrice;
        setValue(`items.${index}.total`, total, { shouldValidate: true, shouldDirty: true });
    };

    const handleChange = (index: number, field: ItemField, value: string | number) => {

        setValue(`items.${index}.${field}`, value);
        if (field === 'quantity' || field === 'unitPrice') {
            const quantity = getValues(`items.${index}.quantity`) || 0;
            const unitPrice = getValues(`items.${index}.unitPrice`) || 0;
            calculateTotal(index, quantity, unitPrice);
        }
    };

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 bg-gray-50 p-6 md:p-8 lg:p-12">
                <h1 className="text-3xl font-bold text-gray-700 mb-6">Criar Orçamento</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Input  crossOrigin={undefined} label="Nome do Cliente" {...register('clientName')} />
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
                                        label="CNPJ do Cliente"
                                        onChange={(e) => field.onChange(e)}
                                        value={field.value}
                                    />
                                )}

                            />
                            {errors.clientCnpj && <p className="text-red-500 text-sm">{errors.clientCnpj.message}</p>}

                        </div>
                        <div>
                            <Input  crossOrigin={undefined} label="Email do Cliente" type="email" {...register('clientEmail')} />
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
                                        label="Telefone do Cliente"

                                        onChange={(e) => field.onChange(e)}
                                        value={field.value}
                                    />
                                )}
                            />

                            {errors.clientPhone && <p className="text-red-500 text-sm">{errors.clientPhone.message}</p>}
                        </div>
                        <div>
                            <Textarea  label="Descrição" {...register('description')} />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>
                        <div>
                            <Input crossOrigin={undefined} label="Valor" type="number" {...register('amount')} />
                            {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
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
                        <div>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Select placeholder={undefined} label="Tipo" {...field}>
                                        <Option value="contract">Contrato</Option>
                                        <Option value="service">Serviço</Option>
                                    </Select>
                                )}
                            />
                            {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Itens</h2>
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
                                            onClick={() => remove(index)}
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
                            onClick={() => append({ description: '', quantity: 0, unitPrice: null, total: 0 })}
                            className="mt-4" placeholder={undefined}                        >
                            <div className="flex items-center space-x-2">
                                <PlusIcon className="h-5 w-5" />
                                <span>Adicionar Item</span>
                            </div>
                        </Button>
                    </div>

                    <div className="mt-6">
                        <Button type="submit" color="green" placeholder={undefined} >
                            Enviar Orçamento
                        </Button>
                    </div>

                </form>
            </main>
        </div>
    );
};

export default Budget;
