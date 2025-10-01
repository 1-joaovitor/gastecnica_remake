"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { receiptSchema, ReceiptFormData } from '../schema';
import { createReceipt, validateReceiptSignature } from '@/services/receipt';
import { getClients, Client } from '@/services/client';
import { toast } from 'react-hot-toast';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NewReceiptPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [signatureValidation, setSignatureValidation] = useState<{
    isValid: boolean;
    message: string;
    loading: boolean;
  }>({
    isValid: false,
    message: '',
    loading: false
  });
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ReceiptFormData>({
    resolver: zodResolver(receiptSchema)
  });

  const watchedAmount = watch('amount');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await getClients(1, 100);
      setClients(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast.error('Erro ao carregar clientes');
    }
  };

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
    setValue('clientName', client.name);
    setValue('clientCnpj', client.cnpj);
    setValue('clientEmail', client.email);
    setValue('clientPhone', client.phone);
    setValue('clientAddress', client.address || '');
    setValue('clientCity', client.city || '');
    setValue('clientState', client.state || '');
    setValue('clientZipCode', client.zipCode || '');
    setValue('client', { id: client.id });
  };

  const validateSignature = async (signature: string) => {
    if (!signature.trim()) {
      setSignatureValidation({
        isValid: false,
        message: '',
        loading: false
      });
      return;
    }

    setSignatureValidation({
      isValid: false,
      message: 'Validando assinatura...',
      loading: true
    });

    try {
      // Validação simples: assinatura deve ter pelo menos 10 caracteres
      const isValid = signature.length >= 10;

      setSignatureValidation({
        isValid,
        message: isValid ? 'Assinatura válida' : 'Assinatura deve ter pelo menos 10 caracteres',
        loading: false
      });
    } catch (error) {
      setSignatureValidation({
        isValid: false,
        message: 'Erro ao validar assinatura',
        loading: false
      });
    }
  };

  const convertNumberToWords = (value: number): string => {
    // Verificar se o valor é válido
    if (!value || isNaN(value) || value < 0) {
      return 'valor inválido';
    }

    const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    const teens = ['dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
    const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
    const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

    if (value === 0) return 'zero reais';

    const integerPart = Math.floor(value);
    const decimalPart = Math.round((value - integerPart) * 100);

    let result = convertIntegerToWords(integerPart);
    result += integerPart === 1 ? ' real' : ' reais';

    if (decimalPart > 0) {
      result += ' e ' + convertIntegerToWords(decimalPart);
      result += decimalPart === 1 ? ' centavo' : ' centavos';
    }

    return result;
  };

  const convertIntegerToWords = (num: number): string => {
    if (num === 0) return 'zero';
    if (num < 10) return getUnits(num);
    if (num < 20) return getTeens(num);
    if (num < 100) return getTens(num);
    if (num < 1000) return getHundreds(num);
    if (num < 1000000) return getThousands(num);
    if (num < 1000000000) return getMillions(num);
    return 'número muito grande';
  };

  const getUnits = (num: number): string => {
    const units = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
    return units[num];
  };

  const getTeens = (num: number): string => {
    const teens = ['dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
    return teens[num - 10];
  };

  const getTens = (num: number): string => {
    const tens = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
    const unit = num % 10;
    const ten = Math.floor(num / 10);

    if (unit === 0) return tens[ten];
    return tens[ten] + ' e ' + getUnits(unit);
  };

  const getHundreds = (num: number): string => {
    const hundreds = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;

    if (remainder === 0) return hundreds[hundred];
    if (hundred === 1 && remainder < 100) return 'cento e ' + convertIntegerToWords(remainder);
    return hundreds[hundred] + ' e ' + convertIntegerToWords(remainder);
  };

  const getThousands = (num: number): string => {
    const thousand = Math.floor(num / 1000);
    const remainder = num % 1000;

    let result = convertIntegerToWords(thousand) + ' mil';
    if (remainder > 0) {
      result += ' e ' + convertIntegerToWords(remainder);
    }
    return result;
  };

  const getMillions = (num: number): string => {
    const million = Math.floor(num / 1000000);
    const remainder = num % 1000000;

    let result = convertIntegerToWords(million) + ' milhão';
    if (million > 1) result += 'ões';
    if (remainder > 0) {
      result += ' e ' + convertIntegerToWords(remainder);
    }
    return result;
  };

  const onSubmit = async (data: ReceiptFormData) => {
    try {
      setLoading(true);

      // Converter valor por extenso
      if (data.amount) {
        data.amountInWords = convertNumberToWords(data.amount);
      }

      // Definir datas padrão
      data.receiptDate = data.receiptDate || new Date();
      data.dueDate = data.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      // Definir informações da empresa
      // Informações da empresa são fixas no PDF

      await createReceipt(data);
      toast.success('Recibo criado com sucesso!');
      router.push('/receipts');
    } catch (error) {
      console.error('Erro ao criar recibo:', error);
      toast.error('Erro ao criar recibo');
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Novo Recibo</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Cliente</h2>

          {/* Seleção de Cliente */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selecionar Cliente Existente
            </label>
            <select
              onChange={(e) => {
                const client = clients.find(c => c.id === e.target.value);
                if (client) handleClientSelect(client);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione um cliente...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name} - {client.cnpj}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Cliente *
              </label>
              <input
                {...register('clientName')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nome do cliente"
              />
              {errors.clientName && (
                <p className="text-red-500 text-sm mt-1">{errors.clientName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CNPJ *
              </label>
              <input
                {...register('clientCnpj')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="00.000.000/0000-00"
              />
              {errors.clientCnpj && (
                <p className="text-red-500 text-sm mt-1">{errors.clientCnpj.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                {...register('clientEmail')}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@exemplo.com"
              />
              {errors.clientEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.clientEmail.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefone *
              </label>
              <input
                {...register('clientPhone')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(00) 00000-0000"
              />
              {errors.clientPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.clientPhone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Endereço
              </label>
              <input
                {...register('clientAddress')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Endereço completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidade
              </label>
              <input
                {...register('clientCity')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cidade"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <input
                {...register('clientState')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="UF"
                maxLength={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CEP
              </label>
              <input
                {...register('clientZipCode')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="00000-000"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Recibo</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição do Serviço *
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Descreva o serviço prestado..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor *
                </label>
                <input
                  {...register('amount', {
                    valueAsNumber: true,
                    onChange: (e) => {
                      try {
                        const value = parseFloat(e.target.value) || 0;
                        setValue('amount', value);
                      } catch (error) {
                        console.error('Erro ao processar valor:', error);
                        setValue('amount', 0);
                      }
                    }
                  })}
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  onInput={(e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.value && !isNaN(parseFloat(target.value))) {
                      const value = parseFloat(target.value);
                      if (value >= 0) {
                        setValue('amount', value);
                      }
                    }
                  }}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  {...register('status')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pendente</option>
                  <option value="paid">Pago</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </div>

            {watchedAmount && watchedAmount > 0 && !isNaN(watchedAmount) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor por Extenso
                </label>
                <div className="p-3 bg-gray-50 border border-gray-300 rounded-md">
                  <p className="text-sm text-gray-700 italic">
                    {convertNumberToWords(watchedAmount)}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data do Recibo
                </label>
                <input
                  {...register('receiptDate', { valueAsDate: true })}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Vencimento
                </label>
                <input
                  {...register('dueDate', { valueAsDate: true })}
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assinatura Digital
                {signatureValidation.isValid && (
                  <span className="ml-2 text-green-600 text-xs">✓ Válida</span>
                )}
                {signatureValidation.message && !signatureValidation.isValid && (
                  <span className="ml-2 text-red-600 text-xs">✗ Inválida</span>
                )}
              </label>
              <textarea
                {...register('digitalSignature')}
                rows={3}
                className={`w-full px-3 py-2 border-2 rounded-md focus:outline-none focus:ring-2 transition-colors ${signatureValidation.isValid
                  ? 'border-green-500 focus:ring-green-500 bg-green-50'
                  : signatureValidation.message
                    ? 'border-red-500 focus:ring-red-500 bg-red-50'
                    : 'border-gray-300 focus:ring-blue-500'
                  }`}
                placeholder="Digite sua assinatura digital (mínimo 10 caracteres)"
                onChange={(e) => {
                  const value = e.target.value;
                  validateSignature(value);
                }}
              />
              {signatureValidation.message && (
                <div className={`mt-2 text-sm flex items-center ${signatureValidation.isValid ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {signatureValidation.loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      {signatureValidation.message}
                    </>
                  ) : (
                    <>
                      {signatureValidation.isValid ? (
                        <span className="text-green-600 mr-1">✓</span>
                      ) : (
                        <span className="text-red-600 mr-1">✗</span>
                      )}
                      {signatureValidation.message}
                    </>
                  )}
                </div>
              )}
              <div className="mt-1 text-xs text-gray-500">
                A assinatura será validada automaticamente e incluída no PDF
              </div>
            </div>
          </div>
        </div>


        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Criar Recibo'}
          </button>
        </div>
      </form>
    </div>
  );
}
