import api from "./api";

export interface Receipt {
    id?: string;
    clientName: string;
    clientCnpj: string;
    clientEmail: string;
    clientPhone: string;
    clientAddress?: string;
    clientCity?: string;
    clientState?: string;
    clientZipCode?: string;
    description: string;
    amount: number;
    amountInWords?: string;
    status: 'pending' | 'paid' | 'cancelled';
    digitalSignature?: string;
    receiptDate?: Date;
    dueDate?: Date;
    createdAt?: string;
    updatedAt?: string;
    client?: any;
    user?: any;
}

export interface ReceiptResponse {
    receipts: Receipt[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const createReceipt = async (receiptData: Omit<Receipt, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
        const response = await api.post('/receipts', receiptData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar recibo:', error);
        throw error;
    }
};

export const getReceipts = async (page: number = 1, limit: number = 10, clientId?: string, status?: string): Promise<ReceiptResponse> => {
    try {
        let url = `/receipts?page=${page}&limit=${limit}`;
        if (clientId) url += `&clientId=${clientId}`;
        if (status) url += `&status=${status}`;

        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar recibos:', error);
        throw error;
    }
};

export const getReceiptById = async (id: string): Promise<Receipt> => {
    try {
        const response = await api.get(`/receipts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar recibo:', error);
        throw error;
    }
};

export const updateReceipt = async (id: string, receiptData: Partial<Receipt>) => {
    try {
        const response = await api.put(`/receipts/${id}`, receiptData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar recibo:', error);
        throw error;
    }
};

export const deleteReceipt = async (id: string) => {
    try {
        const response = await api.delete(`/receipts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar recibo:', error);
        throw error;
    }
};

export const getReceiptsByStatus = async (status: string): Promise<Receipt[]> => {
    try {
        const response = await api.get(`/receipts/status/${status}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar recibos por status:', error);
        throw error;
    }
};

export const getReceiptsByDateRange = async (startDate: string, endDate: string): Promise<Receipt[]> => {
    try {
        const response = await api.get(`/receipts/date-range?startDate=${startDate}&endDate=${endDate}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar recibos por período:', error);
        throw error;
    }
};

export const generateReceiptPDF = async (id: string) => {
    try {
        const response = await api.get(`/receipts/${id}/pdf`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao gerar PDF do recibo:', error);
        throw error;
    }
};

export const sendReceiptPDFByEmail = async (id: string, email: string, customMessage?: string) => {
    try {
        const response = await api.post(`/receipts/${id}/send-email`, {
            email,
            customMessage
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao enviar PDF do recibo por email:', error);
        throw error;
    }
};

// Validação de assinatura digital
export const validateReceiptSignature = async (id: string): Promise<{
    success: boolean;
    validation: {
        isValid: boolean;
        certificate: any;
        integrity: any;
        qrCode: string;
    };
}> => {
    try {
        const response = await api.get(`/receipts/${id}/validate-signature`);
        return response.data;
    } catch (error) {
        console.error('Erro ao validar assinatura do recibo:', error);
        throw error;
    }
};

export const updateReceiptSignature = async (id: string, signature: string): Promise<Receipt> => {
    try {
        const response = await api.put(`/receipts/${id}/signature`, { signature });
        return response.data.receipt;
    } catch (error) {
        console.error('Erro ao atualizar assinatura do recibo:', error);
        throw error;
    }
};

export const generateReceiptCertificate = async (id: string): Promise<{
    success: boolean;
    certificate: any;
    qrCode: string;
    integrity: any;
}> => {
    try {
        const response = await api.get(`/receipts/${id}/certificate`);
        return response.data;
    } catch (error) {
        console.error('Erro ao gerar certificado do recibo:', error);
        throw error;
    }
};
