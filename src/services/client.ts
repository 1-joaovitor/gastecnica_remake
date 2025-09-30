import api from './api';

export interface Client {
    id: string;
    name: string;
    cnpj: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    createdAt: string;
    updatedAt: string;
    budgets?: any[];
}

export interface ClientResponse {
    data: Client[];
    totalPages: number;
    currentPage: number;
    total: number;
}

export const getClients = async (page: number = 1, limit: number = 10): Promise<ClientResponse> => {
    try {
        console.log('Fazendo requisição para /clients com página:', page, 'limite:', limit);
        const response = await api.get(`/clients?page=${page}&limit=${limit}`);
        console.log('Resposta da API de clientes:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        console.error('Detalhes do erro:', error.response?.data);
        console.error('Status do erro:', error.response?.status);
        throw error;
    }
};

export const getClientById = async (id: string): Promise<Client> => {
    try {
        const response = await api.get(`/clients/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar cliente:', error);
        throw error;
    }
};

export const createClient = async (clientData: Partial<Client>): Promise<Client> => {
    try {
        const response = await api.post('/clients', clientData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar cliente:', error);
        throw error;
    }
};

export const updateClient = async (id: string, clientData: Partial<Client>): Promise<Client> => {
    try {
        const response = await api.put(`/clients/${id}`, clientData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        throw error;
    }
};

export const deleteClient = async (id: string): Promise<void> => {
    try {
        await api.delete(`/clients/${id}`);
    } catch (error) {
        console.error('Erro ao deletar cliente:', error);
        throw error;
    }
};
