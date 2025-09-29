'use client'

import Sidebar from "@/components/sidebar";
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    CardFooter,
    IconButton,
    Tooltip,
    Chip,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import { PencilIcon, EyeIcon, DocumentTextIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";
import PdfDocument from "@/components/pdf-document";
import { pdf } from "@react-pdf/renderer";



const TABLE_HEAD = ["ID", "Nome do Cliente", "CNPJ", "Email", "Telefone", "Descrição", "Valor", "Status", "Tipo", "Data de Criação", "Ações"];

const TABLE_ROWS = [
    {
        id: "1",
        clientName: "Cliente A",
        clientCnpj: "00.000.000/0001-00",
        clientEmail: "cliente@exemplo.com",
        clientPhone: "(00) 00000-0000",
        description: "Descrição do orçamento",
        amount: "$5000",
        status: "pending",
        type: "avulso",
        createdAt: "2024-08-01",
        items: [
            { description: 'Item 1', quantity: 2, unitPrice: 100, total: 200 },
            { description: 'Item 2', quantity: 1, unitPrice: 300, total: 300 },
        ],
    },
    {
        id: "2",
        clientName: "Cliente B",
        clientCnpj: "00.000.000/0001-00",
        clientEmail: "cliente@exemplo.com",
        clientPhone: "(00) 00000-0000",
        description: "Descrição do orçamento",
        amount: "$5000",
        status: "approved",
        type: "avulso",
        createdAt: "2024-08-01",
        items: [
            { description: 'Item A', quantity: 3, unitPrice: 150, total: 450 },
            { description: 'Item B', quantity: 2, unitPrice: 200, total: 400 },
        ],
    },
    {
        id: "3",
        clientName: "Cliente C",
        clientCnpj: "00.000.000/0001-00",
        clientEmail: "cliente@exemplo.com",
        clientPhone: "(00) 00000-0000",
        description: "Descrição do orçamento",
        amount: "$5000",
        status: "rejected",
        type: "avulso",
        createdAt: "2024-08-01",
        items: [
            { description: 'Item X', quantity: 5, unitPrice: 100, total: 500 },
            { description: 'Item Y', quantity: 4, unitPrice: 120, total: 480 },
        ],
    },
];

type Budget = {
    id: string;
    clientName: string;
    clientCnpj: string;
    clientEmail: string;
    clientPhone: string;
    description: string;
    amount: string;
    status: string;
    type: string;
    createdAt: string;
};

const BudgetList = () => {
    const [open, setOpen] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
    const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

    const handleOpen = (budget: Budget) => {
        setSelectedBudget(budget);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedBudget(null);
    };

    const handleDeleteOpen = (budget: Budget) => {
        setBudgetToDelete(budget);
        setConfirmOpen(true);
    };

    const handleDeleteClose = () => {
        setConfirmOpen(false);
        setBudgetToDelete(null);
    };

    const handleDelete = () => {
        if (budgetToDelete) {
            console.log(`Deleting budget with ID: ${budgetToDelete.id}`);
            handleDeleteClose();
        }
    };

  
    const generatePDF = async (budget:any) => {
        try {
          const blob = await pdf(<PdfDocument budget={budget} />).toBlob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'orcamento.pdf';
          link.click();
          URL.revokeObjectURL(url); 
        } catch (error) {
          console.error('Erro ao gerar PDF:', error);
        }
      };
    return (
        <div className="flex min-h-screen">
           
         <Sidebar />

            <Card className="h-full w-full p-4" placeholder={undefined} >
                <CardHeader floated={false} shadow={false} className="rounded-none" placeholder={undefined}  >
                    <div className="mb-8 flex items-center justify-between gap-8">
                        <div>
                            <Typography variant="h5" color="blue-gray" placeholder={undefined} >
                                Lista de Orçamentos
                            </Typography>
                            <Typography color="gray" className="mt-1 font-normal" placeholder={undefined} >
                                Veja informações sobre todos os orçamentos
                            </Typography>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                            <Button className="flex items-center gap-3 bg-custom-blue" size="sm" placeholder={undefined}  >
                                <Link className="flex items-center gap-3" href={'/budget'}>Adicionar Novo</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <div className="w-full md:w-72">
                            <Input label="Buscar"  crossOrigin={undefined} />
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="overflow-scroll px-0" placeholder={undefined}  >
                    <table className="mt-4 w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                        <Typography variant="small" color="blue-gray" className="font-normal leading-none opacity-70" placeholder={undefined}  >
                                            {head}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {TABLE_ROWS.map((row, index) => {
                                const { id, clientName, clientCnpj, clientEmail, clientPhone, description, amount, status, type, createdAt } = row;
                                const isLast = index === TABLE_ROWS.length - 1;
                                const classes = isLast
                                    ? "p-4"
                                    : "p-4 border-b border-blue-gray-50";

                                return (
                                    <tr key={id}>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined} >
                                                {id}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined} >
                                                {clientName}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined} >
                                                {clientCnpj}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined} >
                                                {clientEmail}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined} >
                                                {clientPhone}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined} >
                                                {description}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined} >
                                                {amount}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Chip
                                                variant="ghost"
                                                size="sm"
                                                value={status}
                                                color={status === 'approved' ? "green" : status === 'rejected' ? "red" : "blue-gray"}
                                                className="w-20"
                                            />
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined} >
                                                {type}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal" placeholder={undefined} >
                                                {createdAt}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <div className="flex space-x-2">
                                                <Tooltip content="Editar Orçamento">
                                                    <IconButton
                                                        variant="text"
                                                        color="blue-gray" placeholder={undefined}                                                     
                                                        
                                                    >
                                                        <PencilIcon className="h-5 w-5" href={`/budget?id=${id}`}/>
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip content="Ver Completo">
                                                    <IconButton
                                                        variant="text"
                                                        color="blue-gray"
                                                        onClick={() => handleOpen(row)} placeholder={undefined}                                                     >
                                                        <EyeIcon className="h-5 w-5" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip content="Gerar PDF">
                                                    <IconButton variant="text" color="blue-gray" placeholder={undefined} onClick={() =>generatePDF(row)}>
                                                        <DocumentTextIcon className="h-5 w-5" />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip content="Apagar Orçamento">
                                                    <IconButton
                                                        variant="text"
                                                        color="red"
                                                        onClick={() => handleDeleteOpen(row)} placeholder={undefined}                                                    >
                                                        <TrashIcon className="h-5 w-5" />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CardBody>
                <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4" placeholder={undefined} >
                    
                    <div>pagination</div>
                </CardFooter>
            </Card>

           
            <Dialog open={open} handler={handleClose} placeholder={undefined} >
                <DialogHeader placeholder={undefined}>Detalhes do Orçamento</DialogHeader>
                <DialogBody placeholder={undefined} >
                    <Typography variant="h6" placeholder={undefined}>{selectedBudget?.clientName}</Typography>
                    <Typography variant="body2">ID: {selectedBudget?.id}</Typography>
                    <Typography variant="body2">CNPJ: {selectedBudget?.clientCnpj}</Typography>
                    <Typography variant="body2">Email: {selectedBudget?.clientEmail}</Typography>
                    <Typography variant="body2">Telefone: {selectedBudget?.clientPhone}</Typography>
                    <Typography variant="body2">Descrição: {selectedBudget?.description}</Typography>
                    <Typography variant="body2">Valor: {selectedBudget?.amount}</Typography>
                    <Typography variant="body2">Status: {selectedBudget?.status}</Typography>
                    <Typography variant="body2">Tipo: {selectedBudget?.type}</Typography>
                    <Typography variant="body2">Data de Criação: {selectedBudget?.createdAt}</Typography>
                </DialogBody>
                <DialogFooter placeholder={undefined} >
                    <Button variant="outlined" color="blue-gray" onClick={handleClose} placeholder={undefined} >
                        Fechar
                    </Button>
                </DialogFooter>
            </Dialog>

          
            <Dialog open={confirmOpen} handler={handleDeleteClose}  >
                <DialogHeader placeholder={undefined} >Confirmação de Exclusão</DialogHeader>
                <DialogBody placeholder={undefined} >
                    <Typography variant="body1">
                        Tem certeza de que deseja excluir o orçamento com ID: {budgetToDelete?.id}?
                    </Typography>
                </DialogBody>
                <DialogFooter className="gap-4" placeholder={undefined} >
                    <Button variant="outlined" color="blue-gray" onClick={handleDeleteClose} placeholder={undefined} >
                        Cancelar
                    </Button>
                    <Button variant="filled" color="red" onClick={handleDelete} placeholder={undefined} >
                        Excluir
                    </Button>
                </DialogFooter>
            </Dialog>
        </div>
    );
};

export default BudgetList;
