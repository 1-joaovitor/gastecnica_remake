import * as Yup from 'yup';
export const schema = Yup.object().shape({
    clientName: Yup.string().when('type', {
        is: 'avulso',
        then: (schema) => schema.required('Campo obrigatório'),
        otherwise: (schema) => schema.nullable()
    }),
    clientCnpj: Yup.string().when('type', {
        is: 'avulso',
        then: (schema) => schema.required('Campo obrigatório'),
        otherwise: (schema) => schema.nullable()
    }),
    clientEmail: Yup.string().when('type', {
        is: 'avulso',
        then: (schema) => schema.email('Email inválido').required('Campo obrigatório'),
        otherwise: (schema) => schema.nullable()
    }),
    clientPhone: Yup.string().when('type', {
        is: 'avulso',
        then: (schema) => schema.required('Campo obrigatório'),
        otherwise: (schema) => schema.nullable()
    }),
    clientId: Yup.string().when('type', {
        is: 'contract',
        then: (schema) => schema.required('Cliente é obrigatório para contratos'),
        otherwise: (schema) => schema.nullable()
    }),
    description: Yup.string().required('Campo obrigatório'),
    amount: Yup.number().nullable(), // Calculado automaticamente
    status: Yup.string().oneOf(['pending', 'approved', 'rejected'], 'Invalid status').required('Campo obrigatório'),
    type: Yup.string().oneOf(['avulso', 'contract'], 'Invalid type').required('Campo obrigatório'),
    items: Yup.array().of(
        Yup.object().shape({
            description: Yup.string().required('Campo obrigatório'),
            quantity: Yup.number().required('Campo obrigatório').positive('Não pode ser zero').integer('Quantity must be an integer'),
            unitPrice: Yup.number().nullable().positive('Unit price must be positive'),
            total: Yup.number().nullable(),
        })
    ).required('É necessário pelo menos um item'),
});