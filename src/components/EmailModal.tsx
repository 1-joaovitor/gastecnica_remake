import React, { useState } from 'react';
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Input,
    Textarea,
    Typography,
    Spinner
} from '@material-tailwind/react';
import { EnvelopeIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { sendBudgetPDFByEmail } from '@/services/budget';
import toast from 'react-hot-toast';

interface EmailModalProps {
    isOpen: boolean;
    onClose: () => void;
    budgetId: string;
    clientName: string;
    clientEmail?: string;
}

const EmailModal: React.FC<EmailModalProps> = ({
    isOpen,
    onClose,
    budgetId,
    clientName,
    clientEmail = ''
}) => {
    const [email, setEmail] = useState(clientEmail);
    const [customMessage, setCustomMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if (!email.trim()) {
            toast.error('Por favor, insira um email válido');
            return;
        }

        setIsSending(true);
        try {
            await sendBudgetPDFByEmail(budgetId, email.trim(), customMessage.trim() || undefined);
            toast.success('PDF enviado por email com sucesso!');
            onClose();
            // Limpar campos
            setEmail(clientEmail);
            setCustomMessage('');
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            toast.error('Erro ao enviar PDF por email');
        } finally {
            setIsSending(false);
        }
    };

    const handleClose = () => {
        if (!isSending) {
            onClose();
            setEmail(clientEmail);
            setCustomMessage('');
        }
    };

    return (
        <Dialog
            open={isOpen}
            handler={handleClose}
            size="md"
            className="bg-white"
            placeholder={undefined}
        >
            <DialogHeader className="flex items-center gap-3" placeholder={undefined}>
                <EnvelopeIcon className="h-6 w-6 text-blue-500" />
                <Typography variant="h5" color="blue-gray" placeholder={undefined}>
                    Enviar PDF por Email
                </Typography>
            </DialogHeader>
            
            <DialogBody className="space-y-4" placeholder={undefined}>
                <div>
                    <Typography variant="small" color="blue-gray" className="mb-2" placeholder={undefined}>
                        Orçamento para: <strong>{clientName}</strong>
                    </Typography>
                </div>

                <div>
                    <Input
                        label="Email do destinatário"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<EnvelopeIcon className="h-5 w-5" />}
                        crossOrigin={undefined}
                        disabled={isSending}
                    />
                </div>

                <div>
                    <Textarea
                        label="Mensagem personalizada (opcional)"
                        value={customMessage}
                        onChange={(e) => setCustomMessage(e.target.value)}
                        rows={4}
                        placeholder="Digite uma mensagem personalizada que será incluída no email..."
                        disabled={isSending}
                    />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                    <Typography variant="small" color="blue-gray" className="flex items-start gap-2" placeholder={undefined}>
                        <PaperAirplaneIcon className="h-4 w-4 mt-0.5 text-blue-500" />
                        O PDF do orçamento será anexado ao email automaticamente.
                    </Typography>
                </div>
            </DialogBody>

            <DialogFooter className="flex gap-2" placeholder={undefined}>
                <Button
                    variant="text"
                    color="gray"
                    onClick={handleClose}
                    disabled={isSending}
                    placeholder={undefined}
                >
                    Cancelar
                </Button>
                <Button
                    color="blue"
                    onClick={handleSend}
                    disabled={isSending || !email.trim()}
                    className="flex items-center gap-2"
                    placeholder={undefined}
                >
                    {isSending ? (
                        <>
                            <Spinner className="h-4 w-4" />
                            Enviando...
                        </>
                    ) : (
                        <>
                            <PaperAirplaneIcon className="h-4 w-4" />
                            Enviar PDF
                        </>
                    )}
                </Button>
            </DialogFooter>
        </Dialog>
    );
};

export default EmailModal;
