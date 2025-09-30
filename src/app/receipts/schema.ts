import * as z from "zod";

export const receiptSchema = z.object({
  clientName: z.string().min(1, "Nome do cliente é obrigatório"),
  clientCnpj: z.string().min(1, "CNPJ do cliente é obrigatório"),
  clientEmail: z.string().email("Email inválido"),
  clientPhone: z.string().min(1, "Telefone do cliente é obrigatório"),
  clientAddress: z.string().optional(),
  clientCity: z.string().optional(),
  clientState: z.string().optional(),
  clientZipCode: z.string().optional(),
  description: z.string().min(1, "Descrição do serviço é obrigatória"),
  amount: z.number().min(0.01, "Valor deve ser maior que zero"),
  status: z.enum(['pending', 'paid', 'cancelled']).default('pending'),
  digitalSignature: z.string().optional(),
  receiptDate: z.date().optional(),
  dueDate: z.date().optional(),
  client: z.object({
    id: z.string()
  }).optional()
});

export type ReceiptFormData = z.infer<typeof receiptSchema>;
