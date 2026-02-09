"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Input, Textarea, Button, Spinner } from '@material-tailwind/react';
import Sidebar from '@/components/sidebar';
import { createBill, CreateBillData } from '@/services/bill';
import { toast } from 'react-hot-toast';
import { ArrowLeftIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import { Typography } from '@material-tailwind/react';

export default function NewBillPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast.error('Apenas arquivos PDF são permitidos');
        return;
      }
      setSelectedFile(file);
    }
  };

  const onSubmit = async (data: any) => {
    if (!selectedFile) {
      toast.error('Por favor, selecione um arquivo PDF');
      return;
    }

    try {
      setLoading(true);
      const billData: CreateBillData = {
        pdf: selectedFile,
        beneficiary: data.beneficiary || undefined,
        notes: data.notes || undefined,
      };

      const bills = await createBill(billData);
      
      if (bills.length > 1) {
        toast.success(`${bills.length} boletos criados com sucesso!`);
      } else {
        toast.success('Boleto criado com sucesso!');
      }
      
      router.push('/bills');
    } catch (error: any) {
      console.error('Erro ao criar boleto:', error);
      toast.error(error?.response?.data?.message || 'Erro ao criar boleto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <Button
            variant="text"
            className="mb-4 flex items-center gap-2"
            onClick={() => router.back()}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Voltar
          </Button>
          <Typography variant="h2" color="blue-gray">
            Novo Boleto
          </Typography>
          <Typography color="gray" className="mt-1 font-normal">
            Faça upload do PDF do boleto e informe os dados
          </Typography>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl">
          <div className="space-y-6">
            {/* Upload de PDF */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arquivo PDF do Boleto *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mb-4" />
                  <Typography variant="small" color="gray" className="mb-2">
                    Clique para selecionar ou arraste o arquivo PDF
                  </Typography>
                  {selectedFile && (
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {selectedFile.name}
                    </Typography>
                  )}
                </label>
              </div>
              {!selectedFile && (
                <Typography variant="small" color="red" className="mt-1">
                  Arquivo PDF é obrigatório
                </Typography>
              )}
            </div>

            {/* Beneficiário */}
            <div>
              <Input
                label="Beneficiário (Quem vai receber) - Opcional"
                helperText="Se não informado, será extraído automaticamente do PDF"
                {...register('beneficiary')}
              />
            </div>

            {/* Observações */}
            <div>
              <Textarea
                label="Observações"
                {...register('notes')}
                rows={4}
              />
            </div>

            {/* Botões */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outlined"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || !selectedFile}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Criando...
                  </>
                ) : (
                  'Criar Boleto'
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

