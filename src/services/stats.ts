import api from "./api";

export interface GeneralStats {
    totals: {
        budgets: number;
        receipts: number;
        clients: number;
        budgetValue: number;
        receiptValue: number;
    };
    status: {
        approvedBudgets: number;
        pendingBudgets: number;
        rejectedBudgets: number;
        paidReceipts: number;
        pendingReceipts: number;
        cancelledReceipts: number;
    };
    values: {
        budgets: {
            approved: number;
            pending: number;
            rejected: number;
            total: number;
        };
        receipts: {
            paid: number;
            pending: number;
            total: number;
        };
    };
    recent: {
        budgets: any[];
        receipts: any[];
        clients: any[];
    };
}

export interface MonthlyStats {
    budgets: Array<{
        month: string;
        count: string;
        total: string;
    }>;
    receipts: Array<{
        month: string;
        count: string;
        total: string;
    }>;
}

export const getGeneralStats = async (): Promise<GeneralStats> => {
    try {
        const response = await api.get('/stats/general');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar estatísticas gerais:', error);
        throw error;
    }
};

export const getMonthlyStats = async (): Promise<MonthlyStats> => {
    try {
        const response = await api.get('/stats/monthly');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar estatísticas mensais:', error);
        throw error;
    }
};
