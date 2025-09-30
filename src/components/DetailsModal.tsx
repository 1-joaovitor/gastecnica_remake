'use client';

import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Typography,
    Card,
    CardBody,
    Chip,
} from "@material-tailwind/react";
import {
    UserIcon,
    BuildingOfficeIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    CalendarIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
    TagIcon
} from "@heroicons/react/24/outline";

interface DetailItem {
    label: string;
    value: string | number | undefined;
    icon?: React.ReactNode;
    type?: 'text' | 'email' | 'phone' | 'currency' | 'date' | 'status';
}

interface DetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    details: DetailItem[];
    type?: 'client' | 'budget';
}

const DetailsModal = ({
    isOpen,
    onClose,
    title,
    subtitle,
    details,
    type = 'client'
}: DetailsModalProps) => {
    const formatValue = (value: string | number | undefined, valueType?: string) => {
        if (!value) return 'Não informado';

        switch (valueType) {
            case 'currency':
                return `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            case 'date':
                return new Date(value).toLocaleDateString('pt-BR');
            case 'email':
                return value;
            case 'phone':
                return value;
            default:
                return value;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved':
            case 'aprovado':
                return 'green';
            case 'rejected':
            case 'rejeitado':
                return 'red';
            case 'pending':
            case 'pendente':
                return 'blue';
            default:
                return 'gray';
        }
    };

    const getStatusText = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'Aprovado';
            case 'rejected':
                return 'Rejeitado';
            case 'pending':
                return 'Pendente';
            case 'avulso':
                return 'Avulso';
            case 'contract':
                return 'Contrato';
            default:
                return status;
        }
    };

    return (
        <Dialog
            open={isOpen}
            handler={onClose}
            size="lg"
            placeholder={undefined}
            className="max-h-[90vh] overflow-y-auto"
        >
            <DialogHeader placeholder={undefined} className="pb-2">
                <div className="flex items-center gap-3">
                    {type === 'client' ? (
                        <UserIcon className="h-6 w-6 text-blue-500" />
                    ) : (
                        <DocumentTextIcon className="h-6 w-6 text-green-500" />
                    )}
                    <div>
                        <Typography variant="h4" color="blue-gray" placeholder={undefined}>
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography variant="small" color="gray" placeholder={undefined}>
                                {subtitle}
                            </Typography>
                        )}
                    </div>
                </div>
            </DialogHeader>

            <DialogBody placeholder={undefined} className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {details.map((detail, index) => (
                        <Card key={index} className="p-4 shadow-sm border border-gray-100" placeholder={undefined}>
                            <CardBody className="p-0" placeholder={undefined}>
                                <div className="flex items-start gap-3">
                                    {detail.icon && (
                                        <div className="flex-shrink-0 mt-1">
                                            {detail.icon}
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-semibold mb-1"
                                            placeholder={undefined}
                                        >
                                            {detail.label}
                                        </Typography>
                                        {detail.type === 'status' ? (
                                            <Chip
                                                value={getStatusText(detail.value as string)}
                                                color={getStatusColor(detail.value as string)}
                                                size="sm"
                                                className="w-fit"
                                            />
                                        ) : (
                                            <Typography
                                                variant="paragraph"
                                                color="blue-gray"
                                                className="break-words"
                                                placeholder={undefined}
                                            >
                                                {formatValue(detail.value, detail.type)}
                                            </Typography>
                                        )}
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </DialogBody>

            <DialogFooter placeholder={undefined} className="pt-4">
                <Button
                    variant="outlined"
                    color="blue-gray"
                    onClick={onClose}
                    placeholder={undefined}
                    className="flex items-center gap-2"
                >
                    Fechar
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default DetailsModal;
