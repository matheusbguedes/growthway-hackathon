"use client";

import { createClass } from "@/app/api/class/create-class";
import { createTask } from "@/app/api/class/create-task";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { z } from "zod";

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

interface ScheduleClassModalProps {
  studentId: string;
}

export function ScheduleClassModal({ studentId }: ScheduleClassModalProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ClassStatus>("PENDING");
  const [tasks, setTasks] = useState<string[]>([]);
  const [taskInput, setTaskInput] = useState("");

  const queryClient = useQueryClient();

  const { reset, register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const addTask = () => {
    const trimmed = taskInput.trim();
    if (!trimmed) return;
    setTasks((prev) => [...prev, trimmed]);
    setTaskInput("");
  };

  const removeTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const { mutate: createClassFn, isPending } = useMutation({
    mutationFn: createClass,
    onSuccess: async (newClass) => {
      // Criar tasks vinculadas à aula recém criada
      if (tasks.length > 0) {
        await Promise.all(
          tasks.map((title) => createTask(newClass.id, { title }))
        );
      }
      reset();
      setStatus("PENDING");
      setTasks([]);
      setTaskInput("");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["student", studentId] });
      toast.success("Aula agendada com sucesso");
    },
    onError: () => toast.error("Erro ao agendar aula"),
  });

  const onSubmit = (data: FormData) => {
    createClassFn({
      student_id: studentId,
      title: data.title,
      description: data.description,
      date: data.date,
      url: data.url || undefined,
      notes: data.notes,
      status,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 h-9 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-95">        <Plus className="size-4" />
        Agendar aula
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agendar aula</DialogTitle>
          <DialogDescription>Registre uma nova aula para este aluno</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 pt-2">
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

          {/* Status */}
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

          {/* Tarefas */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-zinc-400">Tarefas (opcional)</label>

            {tasks.length > 0 && (
              <div className="flex flex-col gap-1.5 mb-1">
                {tasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/50 px-3 py-2"
                  >
                    <span className="text-sm text-foreground">{task}</span>
                    <button
                      type="button"
                      onClick={() => removeTask(index)}
                      className="text-muted-foreground hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTask();
                  }
                }}
                placeholder="Nome da tarefa... (Enter para adicionar)"
                className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm outline-none placeholder:text-zinc-400 focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={addTask}
                disabled={!taskInput.trim()}
                className="shrink-0 inline-flex items-center justify-center rounded-xl border border-border px-3 text-sm text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Agendar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}