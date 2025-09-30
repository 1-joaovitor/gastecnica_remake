'use client';

import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Typography,
} from "@material-tailwind/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isLoading = false,
    type = 'danger'
}: ConfirmationModalProps) => {
    const getButtonColor = () => {
        switch (type) {
            case 'danger':
                return 'red';
            case 'warning':
                return 'yellow';
            case 'info':
                return 'blue';
            default:
                return 'red';
        }
    };

    const getIconColor = () => {
        switch (type) {
            case 'danger':
                return 'text-red-500';
            case 'warning':
                return 'text-yellow-500';
            case 'info':
                return 'text-blue-500';
            default:
                return 'text-red-500';
        }
    };

    return (
        <Dialog open={isOpen} handler={onClose} placeholder={undefined}>
            <DialogHeader placeholder={undefined}>
                <div className="flex items-center gap-3">
                    <ExclamationTriangleIcon className={`h-6 w-6 ${getIconColor()}`} />
                    <Typography variant="h5" color="blue-gray" placeholder={undefined}>
                        {title}
                    </Typography>
                </div>
            </DialogHeader>
            <DialogBody placeholder={undefined}>
                <Typography variant="body1" color="blue-gray" placeholder={undefined}>
                    {message}
                </Typography>
            </DialogBody>
            <DialogFooter className="gap-4" placeholder={undefined}>
                <Button
                    variant="outlined"
                    color="blue-gray"
                    onClick={onClose}
                    disabled={isLoading}
                    placeholder={undefined}
                >
                    {cancelText}
                </Button>
                <Button
                    variant="filled"
                    color={getButtonColor()}
                    onClick={onConfirm}
                    disabled={isLoading}
                    placeholder={undefined}
                >
                    {isLoading ? "Processando..." : confirmText}
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default ConfirmationModal;
