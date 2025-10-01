'use client';

import { useState } from 'react';
import { Button, IconButton, Spinner } from "@material-tailwind/react";
import { MinusIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useAuth } from '@/context/authContext';
import { Avatar, Typography } from "@material-tailwind/react";
import { useRouter } from 'next/navigation';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleSidebar = () => setOpen(!open);

    const closeSidebar = () => {
        if (open) setOpen(false);
    };

    const toggleSubmenu = () => setIsSubmenuOpen(!isSubmenuOpen);
    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            router.push('/');
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <div className="flex min-h-screen">
            <aside
                className={`min-h-screen bg-custom-blue text-white w-64 p-6 transform ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 fixed md:relative z-20 overflow-hidden`}
            >

                <div className="flex justify-center items-center text-2xl font-bold mb-6">
                    <Image
                        width={100}
                        height={50}
                        src="/image/logo.png"
                        alt="Logo"
                        className="h-auto"
                    />
                </div>


                {user && (
                    <div className="flex items-center space-x-4 mb-6">
                        <Avatar
                            src="https://cdn-icons-png.flaticon.com/128/3135/3135768.png"
                            alt={user.nomeFantasia}
                            size="md"
                            className="w-12 h-12 flex-shrink-0" placeholder={undefined} />
                        <div className="min-w-0 flex-1">
                            <Typography 
                                variant="h6" 
                                color="white" 
                                className="truncate" 
                                placeholder={undefined}
                            >
                                {user.nomeFantasia}
                            </Typography>
                            <Typography 
                                variant="small" 
                                color="white" 
                                className="truncate text-xs" 
                                placeholder={undefined}
                            >
                                {user.email}
                            </Typography>
                        </div>
                    </div>
                )}

                <div className="text-2xl font-bold mb-4">
                    Menu
                </div>
                <nav>
                    <ul className="space-y-2">
                        <li><a href="/home" className="block p-2 hover:bg-blue-600 rounded">Dashboard</a></li>
                        <li>
                            <button
                                onClick={toggleSubmenu}
                                className="w-full text-left p-2 hover:bg-blue-600 rounded flex items-center justify-between"
                            >
                                Orçamentos
                                {isSubmenuOpen ? (
                                    <ChevronUpIcon className="h-5 w-5 text-white" />
                                ) : (
                                    <ChevronDownIcon className="h-5 w-5 text-white" />
                                )}
                            </button>
                            {isSubmenuOpen && (
                                <ul className="space-y-2 pl-4 mt-2">
                                    <li><a href="/budget" className="block p-2 hover:bg-blue-700 rounded">Criar Orçamento</a></li>
                                    <li><a href="/budget-list" className="block p-2 hover:bg-blue-700 rounded">Lista de Orçamentos</a></li>
                                </ul>
                            )}
                        </li>
                        <li><a href="/receipts" className="block p-2 hover:bg-blue-600 rounded">Recibos</a></li>
                        {/* <li><a href="#" className="block p-2 hover:bg-blue-600 rounded">Colaboradores</a></li> */}
                        <li><a href="/clients" className="block p-2 hover:bg-blue-600 rounded">Clientes</a></li>
                    </ul>
                </nav>


                <div className=" bottom-0 pt-6">
                    <Button disabled={loading} onClick={handleLogout} className="rounded-full flex w-full justify-center bg-red-400" placeholder={undefined}>
                        {loading ? <Spinner className="w-5 h-5 animate-spin" /> : 'Sair'}
                    </Button>
                </div>
            </aside>

            {open && <div className="fixed inset-0 bg-black opacity-50 z-10 md:hidden" onClick={closeSidebar}></div>}

            <div className="flex-1 flex flex-col right-0 fixed z-10" onClick={closeSidebar}>
                <header className="bg-transparent p-4 flex items-end justify-end md:hidden left">
                    <IconButton variant="text" color="blue" onClick={toggleSidebar} placeholder={undefined} >
                        {open ? <MinusIcon className="h-6 w-6" color='black' /> : <svg color='black' xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                        </svg>}
                    </IconButton>
                </header>
            </div>
        </div>
    );
};

export default Sidebar;
