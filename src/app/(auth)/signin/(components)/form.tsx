"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  email: z.email("Insira um email válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type FormData = z.infer<typeof schema>;

export default function Form() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/";
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit({ email, password }: FormData) {
    setIsLoading(true);
    const result = await signIn("credentials", { email, password, callbackUrl });
    if (result?.status === 401) {
      setIsLoading(false);
      toast.error("Email ou senha inválidos");
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4 space-y-2">
      <Image src="/logo.png" alt="Logo" width={176} height={176} className="w-44 object-contain" />
      <div className="w-full max-w-sm bg-card rounded-2xl shadow-sm border border-border px-8 py-8 flex flex-col gap-5">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="nome@exemplo.com"
            {...register("email")}
            error={errors.email?.message}
          />
          <Input
            id="password"
            type="password"
            label="Senha"
            placeholder="Digite sua senha"
            {...register("password")}
            error={errors.password?.message}
          />
          <Button
            size="xl"
            type="submit"
            loading={isLoading}
          >
            Entrar
          </Button>
        </form>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">ou continue com</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <Button
          size="xl"
          type="button"
          variant="outline"
          className="font-medium bg-white border-border text-foreground hover:bg-muted gap-2.5"
          onClick={() => signIn("google", { callbackUrl })}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
          </svg>
          Continuar com Google
        </Button>
      </div >
      < p className="mt-6 text-sm text-muted-foreground" >
        Não tem uma conta ? {" "}
        < a href="/register" className="text-primary font-medium hover:underline" >
          Criar conta
        </a >
      </p >
    </div >
  );
}