"use client";

import React from "react";
import Image from "next/image";
import {
    Button,
    Input,
    Typography,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Spinner
} from "@material-tailwind/react";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface FormValues {
    email: string;
    password: string;
}

const Login = () => {
    const { login } = useAuth();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

    const onSubmit = async (data: any) => {
        try {
            await login(data);
            router.push('/home');
        } catch (error: any) {
            console.log(error.message || "Ocorreu um erro ao fazer login.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#275984] p-4">
            <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl">

                <div className="flex justify-center mb-6 md:mb-0 md:mr-8">
                    <Image
                        width={350}
                        height={50}
                        src="/image/logo.png"
                        alt="Logo"
                        className="h-auto"
                    />
                </div>
                <Card className="w-full max-w-md bg-white p-12 rounded-2xl shadow-lg border border-gray-200" placeholder={undefined} >
                    <CardHeader className="mb-6 text-center" placeholder={undefined}>
                        <Typography variant="h3" color="black" className="font-semibold" placeholder={undefined} >
                            Login
                        </Typography>
                        <Typography variant="small" color="black" placeholder={undefined} >
                            Acesse sua conta.
                        </Typography>
                    </CardHeader>
                    <CardBody className="space-y-6" placeholder={undefined} >
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 tracking-wide">
                                    Email
                                </label>
                                <Input
                                    crossOrigin={undefined} type="email"
                                    size="lg"
                                    color="blue"
                                    className="w-full border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                                    placeholder="Insira o email"
                                    {...register("email", { required: "Email é obrigatório" })}
                                    aria-invalid={errors.email ? "true" : "false"} />
                                {errors.email && (
                                    <Typography color="red" className="text-xs" placeholder={undefined} >
                                        {errors.email.message}
                                    </Typography>
                                )}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 tracking-wide">
                                    Senha
                                </label>
                                <Input
                                    crossOrigin={undefined} type="password"
                                    size="lg"
                                    color="blue"
                                    className="w-full border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b5e20]"
                                    placeholder="Insira a senha"
                                    {...register("password", { required: "Senha é obrigatória" })}
                                    aria-invalid={errors.password ? "true" : "false"} />
                                {errors.password && (
                                    <Typography color="red" className="text-xs" placeholder={undefined}>
                                        {errors.password.message}
                                    </Typography>
                                )}
                            </div>
                            <Button
                                type="submit"
                                fullWidth
                                color="green"
                                className="py-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500 bg-[#275984] hover:bg-[#4594da] text-white flex items-center justify-center"
                                disabled={isSubmitting}
                                placeholder={undefined}
                            >
                                {isSubmitting ? <Spinner className="w-5 h-5 animate-spin" /> : "Entrar"}
                            </Button>
                        </form>
                    </CardBody>
                    <CardFooter className="pt-5 text-center text-gray-400 text-xs" placeholder={undefined}>
                        <span>
                            Gastécnica © 1998-2024
                        </span>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Login;
