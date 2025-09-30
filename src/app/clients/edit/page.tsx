'use client';

import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, Button, Spinner, Select, Option } from '@material-tailwind/react';
import Sidebar from '@/components/sidebar';
import { getClientById, updateClient, Client } from '@/services/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { schema } from '../new/schema';
import toast from 'react-hot-toast';
import InputMask from '@/components/inputMask';

const EditClient = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const clientId = searchParams.get('id');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, register, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            name: '',
            cnpj: '',
            email: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
        },
    });

    useEffect(() => {
        if (clientId) {
            loadClientData();
        }
    }, [clientId]);

    const loadClientData = async () => {
        if (!clientId) return;
        
        try {
            setIsLoading(true);
            const client = await getClientById(clientId);
            
            reset({
                name: client.name || '',
                cnpj: client.cnpj || '',
                email: client.email || '',
                phone: client.phone || '',
                address: client.address || '',
                city: client.city || '',
                state: client.state || '',
                zipCode: client.zipCode || '',
            });
        } catch (error) {
            console.error('Erro ao carregar cliente:', error);
            toast.error('Erro ao carregar dados do cliente');
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: any) => {
        if (!clientId) return;
        
        setIsSubmitting(true);
        try {
            await updateClient(clientId, data);
            toast.success('Cliente atualizado com sucesso!');
            router.push('/clients');
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            toast.error('Erro ao atualizar cliente. Tente novamente.');
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
                        <p>Carregando dados do cliente...</p>
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
                    Editar Cliente
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Input
                                label="Nome *"
                                {...register('name')}
                                error={!!errors.name}
                                crossOrigin={undefined}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <Controller
                                name="cnpj"
                                control={control}
                                render={({ field }) => (
                                    <InputMask
                                        mask="99.999.999/9999-99"
                                        {...field}
                                        label="CNPJ *"
                                        onChange={(value) => field.onChange(value)}
                                        value={field.value}
                                    />
                                )}
                            />
                            {errors.cnpj && (
                                <p className="text-red-500 text-sm mt-1">{errors.cnpj.message}</p>
                            )}
                        </div>

                        <div>
                            <Input
                                label="Email *"
                                type="email"
                                {...register('email')}
                                error={!!errors.email}
                                crossOrigin={undefined}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <Controller
                                name="phone"
                                control={control}
                                render={({ field }) => (
                                    <InputMask
                                        mask="(99) 99999-9999"
                                        {...field}
                                        label="Telefone *"
                                        onChange={(value) => field.onChange(value)}
                                        value={field.value}
                                    />
                                )}
                            />
                            {errors.phone && (
                                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                            )}
                        </div>

                        <div>
                            <Input
                                label="Endereço"
                                {...register('address')}
                                error={!!errors.address}
                                crossOrigin={undefined}
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                            )}
                        </div>

                        <div>
                            <Input
                                label="Cidade"
                                {...register('city')}
                                error={!!errors.city}
                                crossOrigin={undefined}
                            />
                            {errors.city && (
                                <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                            )}
                        </div>

                        <div>
                            <Controller
                                name="state"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        label="Estado"
                                        {...field}
                                        placeholder={undefined}
                                    >
                                        <Option value="AC">Acre</Option>
                                        <Option value="AL">Alagoas</Option>
                                        <Option value="AP">Amapá</Option>
                                        <Option value="AM">Amazonas</Option>
                                        <Option value="BA">Bahia</Option>
                                        <Option value="CE">Ceará</Option>
                                        <Option value="DF">Distrito Federal</Option>
                                        <Option value="ES">Espírito Santo</Option>
                                        <Option value="GO">Goiás</Option>
                                        <Option value="MA">Maranhão</Option>
                                        <Option value="MT">Mato Grosso</Option>
                                        <Option value="MS">Mato Grosso do Sul</Option>
                                        <Option value="MG">Minas Gerais</Option>
                                        <Option value="PA">Pará</Option>
                                        <Option value="PB">Paraíba</Option>
                                        <Option value="PR">Paraná</Option>
                                        <Option value="PE">Pernambuco</Option>
                                        <Option value="PI">Piauí</Option>
                                        <Option value="RJ">Rio de Janeiro</Option>
                                        <Option value="RN">Rio Grande do Norte</Option>
                                        <Option value="RS">Rio Grande do Sul</Option>
                                        <Option value="RO">Rondônia</Option>
                                        <Option value="RR">Roraima</Option>
                                        <Option value="SC">Santa Catarina</Option>
                                        <Option value="SP">São Paulo</Option>
                                        <Option value="SE">Sergipe</Option>
                                        <Option value="TO">Tocantins</Option>
                                    </Select>
                                )}
                            />
                            {errors.state && (
                                <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
                            )}
                        </div>

                        <div>
                            <Controller
                                name="zipCode"
                                control={control}
                                render={({ field }) => (
                                    <InputMask
                                        mask="99999-999"
                                        {...field}
                                        label="CEP"
                                        onChange={(value) => field.onChange(value)}
                                        value={field.value}
                                    />
                                )}
                            />
                            {errors.zipCode && (
                                <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
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
                                    Atualizando...
                                </>
                            ) : (
                                'Atualizar Cliente'
                            )}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EditClient;
