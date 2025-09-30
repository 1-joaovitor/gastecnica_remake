import api from "./api";

export interface BudgetItem {
    description: string;
    quantity: number;
    unitPrice: number | null;
    total: number;
}

export interface Budget {
    id?: string;
    clientName: string;
    clientCnpj: string;
    clientEmail: string;
    clientPhone: string;
    description: string;
    amount: string;
    status: string;
    type: string;
    items: BudgetItem[];
    createdAt?: string;
    updatedAt?: string;
    client?: any;
}

export interface BudgetResponse {
    data: Budget[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export const createBudget = async (budgetData: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
        const response = await api.post('/budget', budgetData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar orçamento:', error);
        throw error;
    }
};

export const getBudgets = async (page: number = 1, pageSize: number = 10) => {
    try {
        const response = await api.get(`/budget?page=${page}&pageSize=${pageSize}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar orçamentos:', error);
        throw error;
    }
};

export const getBudgetById = async (id: string) => {
    try {
        const response = await api.get(`/budget/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar orçamento:', error);
        throw error;
    }
};

export const updateBudget = async (id: string, budgetData: Partial<Budget>) => {
    try {
        const response = await api.put(`/budget/update/${id}`, budgetData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar orçamento:', error);
        throw error;
    }
};

export const deleteBudget = async (id: string) => {
    try {
        const response = await api.delete(`/budget/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar orçamento:', error);
        throw error;
    }
};

export const generateBudgetPDF = async (id: string) => {
    try {
        const response = await api.get(`/budget/${id}/pdf`, {
            responseType: 'blob'
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        throw error;
    }
};

export const sendBudgetPDFByEmail = async (id: string, email: string, customMessage?: string) => {
    try {
        const response = await api.post(`/budget/${id}/send-email`, {
            email,
            customMessage
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao enviar PDF por email:', error);
        throw error;
    }
};
