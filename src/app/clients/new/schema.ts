import * as Yup from 'yup';

export const schema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Nome deve ter pelo menos 2 caracteres')
        .max(100, 'Nome deve ter no máximo 100 caracteres')
        .required('Nome é obrigatório'),
    cnpj: Yup.string()
        .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ deve estar no formato 00.000.000/0000-00')
        .required('CNPJ é obrigatório'),
    email: Yup.string()
        .email('Email inválido')
        .required('Email é obrigatório'),
    phone: Yup.string()
        .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone deve estar no formato (00) 00000-0000')
        .required('Telefone é obrigatório'),
    address: Yup.string()
        .max(200, 'Endereço deve ter no máximo 200 caracteres'),
    city: Yup.string()
        .max(100, 'Cidade deve ter no máximo 100 caracteres'),
    state: Yup.string()
        .max(2, 'Estado deve ter 2 caracteres')
        .matches(/^[A-Z]{2}$/, 'Estado deve ser a sigla (ex: SP, RJ)'),
    zipCode: Yup.string()
        .matches(/^\d{5}-?\d{3}$/, 'CEP deve estar no formato 00000-000'),
});
