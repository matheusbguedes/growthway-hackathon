"use client";

import { updateClass } from "@/app/api/class/update-class";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/animate-ui/radix/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { z } from "zod";
import type { StudentClass } from "@/types/student";

const schema = z.object({
  title: z.string().optional(),
  description: z.string().min(1, "Descrição é obrigatória"),
  date: z.string().optional(),
  url: z.string().url("URL inválida").optional().or(z.literal("")),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const statusOptions = [
  { value: "PENDING", label: "Pendente", color: "bg-zinc-100 text-zinc-600" },
  { value: "IN_PROGRESS", label: "Em andamento", color: "bg-blue-50 text-blue-600" },
  { value: "IN_REVIEW", label: "Em revisão", color: "bg-amber-50 text-amber-600" },
  { value: "COMPLETED", label: "Concluída", color: "bg-green-50 text-green-600" },
  { value: "CANCELLED", label: "Cancelada", color: "bg-red-50 text-red-500" },
] as const;

type ClassStatus = (typeof statusOptions)[number]["value"];

interface EditClassModalProps {
  classItem: StudentClass;
  studentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditClassModal({
  classItem,
  studentId,
  open,
  onOpenChange,
}: EditClassModalProps) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<ClassStatus>(classItem.status as ClassStatus);

  const { reset, register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (classItem) {
      reset({
        title: classItem.title ?? "",
        description: classItem.description ?? "",
        date: classItem.date ? classItem.date.slice(0, 10) : "",
        url: classItem.url ?? "",
        notes: classItem.notes ?? "",
      });
      setStatus(classItem.status as ClassStatus);
    }
  }, [classItem, reset]);

  const { mutate: updateClassFn, isPending } = useMutation({
    mutationFn: (data: FormData) =>
      updateClass(classItem.id, { ...data, url: data.url || undefined, status }),
    onSuccess: () => {
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["student", studentId] });
      toast.success("Aula atualizada com sucesso");
    },
    onError: () => toast.error("Erro ao atualizar aula"),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar aula</DialogTitle>
          <DialogDescription>Atualize os dados desta aula</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => updateClassFn(data))} className="flex flex-col gap-4 pt-2">
          <Input
            id="title"
            label="Título"
            placeholder="Ex: Revisão de cálculo"
            {...register("title")}
          />

          <Input
            id="description"
            label="Descrição"
            placeholder="Conteúdo da aula"
            error={errors.description?.message}
            {...register("description")}
          />

          <Input
            id="date"
            type="date"
            label="Data"
            {...register("date")}
          />

          <Input
            id="url"
            label="URL (opcional)"
            placeholder="https://meet.google.com/..."
            error={errors.url?.message}
            {...register("url")}
          />

          <Input
            id="notes"
            label="Observações (opcional)"
            placeholder="Anotações sobre a aula"
            {...register("notes")}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-400">Status</label>
            <div className="flex flex-wrap gap-2">
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

          <DialogFooter className="pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}