"use client";

import { createStudent } from "@/app/api/students/create-student";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/animate-ui/radix/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  document: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "PAUSED"]),
});

type StudentCreateFormData = z.infer<typeof schema>;

const statusOptions: { value: StudentCreateFormData["status"]; label: string; color: string }[] = [
  { value: "ACTIVE", label: "Ativo", color: "bg-green-100 text-green-700" },
  { value: "INACTIVE", label: "Inativo", color: "bg-red-100 text-red-700" },
  { value: "PAUSED", label: "Pausado", color: "bg-zinc-100 text-zinc-600" },
];

export function StudentCreateModal() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<StudentCreateFormData["status"]>("ACTIVE");

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StudentCreateFormData>({
    resolver: zodResolver(schema),
    defaultValues: { status: "ACTIVE" },
  });

  const queryClient = useQueryClient();

  const { mutate: createStudentFn, isPending: isCreating } = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      reset();
      setStatus("ACTIVE");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Aluno criado com sucesso");
    },
    onError: (error: string) => toast.error(error),
  });

  const onCreate = (data: StudentCreateFormData) =>
    createStudentFn({ name: data.name, email: data.email, phone: data.phone, document: data.document, status });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-4 h-9 text-sm font-semibold text-white shadow-sm transition-all hover:bg-green-600 hover:shadow-md active:scale-95">
        <Plus className="size-4" />
        Adicionar aluno
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo aluno</DialogTitle>
          <DialogDescription>Adicione um novo aluno ao sistema</DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4 pt-4" onSubmit={handleSubmit(onCreate)}>
          <div className="flex flex-col gap-4">
            <Input
              id="name"
              label="Nome"
              placeholder="Nome do aluno"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="email@exemplo.com"
              error={errors.email?.message}
              {...register("email")}
            />
            <Input
              id="phone"
              label="Telefone"
              placeholder="(11) 99999-9999"
              error={errors.phone?.message}
              {...register("phone")}
            />
            <Input
              id="document"
              label="Documento"
              placeholder="CPF ou RG (opcional)"
              error={errors.document?.message}
              {...register("document")}
            />

            {/* Status — botões inline, sem dropdown */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-zinc-400">Status</label>
              <div className="flex gap-2">
                {statusOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all border-2 ${
                      status === opt.value
                        ? `${opt.color} border-current scale-105 shadow-sm`
                        : "bg-zinc-50 text-zinc-400 border-transparent hover:bg-zinc-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}