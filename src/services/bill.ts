import api from './api';

export type BillStatus = 'pending' | 'paid' | 'overdue';

export interface Bill {
  id: string;
  beneficiary: string;
  amount: number;
  dueDate: string;
  status: BillStatus;
  notes?: string;
  hasPDF: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BillStats {
  total: number;
  pending: number;
  paid: number;
  overdue: number;
  dueToday: number;
  totalAmount: number;
}

export interface CreateBillData {
  beneficiary: string;
  notes?: string;
  pdf: File;
}

export interface UpdateBillData {
  beneficiary?: string;
  amount?: number;
  dueDate?: string;
  notes?: string;
}

/**
 * Cria um ou múltiplos boletos com upload de PDF
 * Se o PDF contiver múltiplos boletos, retorna array com todos
 */
export async function createBill(data: CreateBillData): Promise<Bill[]> {
  const formData = new FormData();
  formData.append('pdf', data.pdf);
  if (data.beneficiary) {
    formData.append('beneficiary', data.beneficiary);
  }
  if (data.notes) {
    formData.append('notes', data.notes);
  }

  const response = await api.post('/bills', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.bills || [response.data.bill];
}

/**
 * Lista todos os boletos do usuário
 */
export async function getAllBills(): Promise<Bill[]> {
  const response = await api.get('/bills');
  return response.data.bills;
}

/**
 * Busca boleto por ID
 */
export async function getBillById(id: string): Promise<Bill> {
  const response = await api.get(`/bills/${id}`);
  return response.data.bill;
}

/**
 * Marca boleto como pago
 */
export async function markBillAsPaid(id: string): Promise<Bill> {
  const response = await api.put(`/bills/${id}/pay`);
  return response.data.bill;
}

/**
 * Atualiza informações do boleto
 */
export async function updateBill(id: string, data: UpdateBillData): Promise<Bill> {
  const response = await api.put(`/bills/${id}`, data);
  return response.data.bill;
}

/**
 * Deleta um boleto
 */
export async function deleteBill(id: string): Promise<void> {
  await api.delete(`/bills/${id}`);
}

/**
 * Retorna estatísticas dos boletos
 */
export async function getBillStats(): Promise<BillStats> {
  const response = await api.get('/bills/stats');
  return response.data.stats;
}

/**
 * Download do PDF do boleto
 */
export async function downloadBillPDF(id: string): Promise<Blob> {
  const response = await api.get(`/bills/${id}/pdf`, {
    responseType: 'blob',
  });
  return response.data;
}

