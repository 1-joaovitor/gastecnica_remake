import * as Yup from 'yup';
export const schema = Yup.object().shape({
    clientName: Yup.string().required('Campo obrigatório'),
    clientCnpj: Yup.string().required('Campo obrigatório'),
    clientEmail: Yup.string().email('Email inválido').required('Campo obrigatório'),
    clientPhone: Yup.string().required('Campo obrigatório'),
    description: Yup.string().required('Campo obrigatório'),
    amount: Yup.string().required('Campo obrigatório'),
    status: Yup.string().oneOf(['pending', 'approved', 'rejected'], 'Invalid status').required('Campo obrigatório'),
    type: Yup.string().oneOf(['contract', 'service'], 'Invalid type').required('Campo obrigatório'),
    items: Yup.array().of(
        Yup.object().shape({
            description: Yup.string().required('Campo obrigatório'),
            quantity: Yup.number().required('Campo obrigatório').positive('Não pode ser zero').integer('Quantity must be an integer'),
            unitPrice: Yup.number().nullable().positive('Unit price must be positive'),
            total: Yup.number().nullable(),
        })
    ).required('É necessário pelo menos um item'),
});