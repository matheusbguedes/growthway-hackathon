"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
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
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit({ email, password }: FormData) {
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      callbackUrl,
    });

    if (result?.status === 401) {
      setIsLoading(false);
      toast.error("Email ou senha inválidos");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md flex flex-col gap-6"
    >
      {/* <Image
        src=""
        alt="Logo"
        width={100}
        height={100}
        className="md:hidden size-20 object-contain mx-auto"
      /> */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold hidden md:block">Entrar</h1>
        <p className="text-sm text-zinc-400 hidden md:block">
          Acesse sua conta para continuar
        </p>
      </div>
      <div className="flex flex-col px-4 md:px-0 space-y-6">
        <Input
          id="email"
          type="email"
          label="Email"
          placeholder="Email@exemplo.com"
          {...register("email")}
          error={errors.email?.message}
        />
        <Input
          id="password"
          type="password"
          label="Senha"
          placeholder="Ao menos 6 caracteres"
          {...register("password")}
          error={errors.password?.message}
        />
        <Button type="submit" loading={isLoading}>
          Entrar <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}