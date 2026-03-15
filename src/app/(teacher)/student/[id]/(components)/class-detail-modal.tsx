"use client";

import { createTask } from "@/app/api/class/create-task";
import { deleteTask } from "@/app/api/class/delete-task";
import { deleteClass } from "@/app/api/class/delete-class";
import { getClassTask } from "@/app/api/class/get-class-task";
import { updateTask } from "@/app/api/class/update-task";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/radix/dialog";
import { Button } from "@/components/ui/button";
import type { StudentClass } from "@/types/student";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2,
  Circle,
  ExternalLink,
  Minus,
  Pencil,
  Plus,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ClassStatusBadge } from "./class-status-badge";
import { EditClassModal } from "./edit-class-modal";

interface ClassDetailModalProps {
  classItem: StudentClass | null;
  studentId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TaskStatus = "PENDING" | "DONE" | "NOT_DONE" | "PARTIAL";

const taskStatusCycle: TaskStatus[] = ["PENDING", "DONE", "NOT_DONE", "PARTIAL"];

const taskStatusConfig: Record<TaskStatus, { icon: typeof Circle; color: string; label: string }> = {
  PENDING: { icon: Circle, color: "text-zinc-400", label: "Pendente" },
  DONE: { icon: CheckCircle2, color: "text-green-500", label: "Feita" },
  NOT_DONE: { icon: XCircle, color: "text-red-400", label: "Não feita" },
  PARTIAL: { icon: Minus, color: "text-amber-400", label: "Parcial" },
};

function formatDatePtBR(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function ClassDetailModal({
  classItem,
  studentId,
  open,
  onOpenChange,
}: ClassDetailModalProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [addingTask, setAddingTask] = useState(false);
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["class-tasks", classItem?.id],
    queryFn: () => getClassTask(classItem!.id),
    enabled: !!classItem?.id && open,
  });

  const { mutate: createTaskFn, isPending: isCreating } = useMutation({
    mutationFn: (title: string) => createTask(classItem!.id, { title }),
    onSuccess: () => {
      setNewTaskTitle("");
      setAddingTask(false);
      queryClient.invalidateQueries({ queryKey: ["class-tasks", classItem?.id] });
    },
    onError: () => toast.error("Erro ao criar tarefa"),
  });

  const { mutate: updateTaskFn } = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      updateTask(classItem!.id, taskId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-tasks", classItem?.id] });
    },
    onError: () => toast.error("Erro ao atualizar tarefa"),
  });

  const { mutate: deleteTaskFn } = useMutation({
    mutationFn: (taskId: string) => deleteTask(classItem!.id, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["class-tasks", classItem?.id] });
      toast.success("Tarefa excluída");
    },
    onError: () => toast.error("Erro ao excluir tarefa"),
  });

  const { mutate: deleteClassFn, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteClass(classItem!.id),
    onSuccess: () => {
      onOpenChange(false);
      setConfirmDelete(false);
      queryClient.invalidateQueries({ queryKey: ["student", studentId] });
      toast.success("Aula excluída com sucesso");
    },
    onError: () => toast.error("Erro ao excluir aula"),
  });

  const handleEditClick = () => {
    onOpenChange(false);
    setTimeout(() => setEditOpen(true), 150);
  };

  const cycleTaskStatus = (task: { id: string; status: TaskStatus }) => {
    const currentIndex = taskStatusCycle.indexOf(task.status);
    const nextStatus = taskStatusCycle[(currentIndex + 1) % taskStatusCycle.length];
    updateTaskFn({ taskId: task.id, status: nextStatus });
  };

  if (!classItem) return null;

  return (
    <>
      {editOpen && (
        <EditClassModal
          classItem={classItem}
          studentId={studentId}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
      )}

      <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); setConfirmDelete(false); }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-3 pr-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {formatDatePtBR(classItem.date)}
                </span>
                <DialogTitle className="text-lg font-semibold leading-snug">
                  {classItem.title ?? "Aula sem título"}
                </DialogTitle>
              </div>

              {/* Ações do header */}
              <div className="mt-1 flex items-center gap-1 shrink-0">
                <button
                  onClick={handleEditClick}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  title="Editar aula"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="Excluir aula"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-5">

            {/* Confirmação de exclusão inline */}
            {confirmDelete && (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-700 font-medium">
                  Excluir esta aula permanentemente?
                </p>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    disabled={isDeleting}
                    className="rounded-lg border border-red-200 bg-white px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => deleteClassFn()}
                    disabled={isDeleting}
                    className="rounded-lg bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? "Excluindo..." : "Confirmar"}
                  </button>
                </div>
              </div>
            )}

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Status
              </span>
              <ClassStatusBadge status={classItem.status} />
            </div>

            {/* Descrição */}
            {classItem.description && (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Conteúdo da aula
                </span>
                <p className="text-sm text-foreground leading-relaxed">
                  {classItem.description}
                </p>
              </div>
            )}

            {/* Meta vinculada */}
            {classItem.goal && (
              <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
                <div className="flex items-start gap-2">
                  <span className="text-lg">🎯</span>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-xs font-medium text-primary uppercase tracking-wide">
                      Meta vinculada
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {classItem.goal.title}
                    </p>
                    {classItem.goal.description && (
                      <p className="text-xs text-muted-foreground">
                        {classItem.goal.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Observações */}
            {classItem.notes && (
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Observações
                </span>
                <div className="rounded-lg border border-border bg-muted/50 px-3 py-2.5">
                  <p className="text-sm text-foreground leading-relaxed">
                    {classItem.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Link */}
            {classItem.url && (
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => window.open(classItem.url!, "_blank")}
              >
                <ExternalLink className="size-4" />
                Acessar link externo
              </Button>
            )}

            {/* Tarefas */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Tarefas
                </span>
                <button
                  onClick={() => setAddingTask(true)}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  <Plus className="size-3" />
                  Adicionar
                </button>
              </div>

              {addingTask && (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newTaskTitle.trim()) createTaskFn(newTaskTitle.trim());
                      if (e.key === "Escape") { setAddingTask(false); setNewTaskTitle(""); }
                    }}
                    placeholder="Nome da tarefa... (Enter para salvar)"
                    className="flex h-9 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm outline-none placeholder:text-zinc-400 focus:border-primary transition-colors"
                  />
                  <button
                    onClick={() => { if (newTaskTitle.trim()) createTaskFn(newTaskTitle.trim()); }}
                    disabled={isCreating || !newTaskTitle.trim()}
                    className="shrink-0 rounded-xl bg-primary px-3 text-xs font-medium text-primary-foreground disabled:opacity-50"
                  >
                    {isCreating ? "..." : "Salvar"}
                  </button>
                  <button
                    onClick={() => { setAddingTask(false); setNewTaskTitle(""); }}
                    className="shrink-0 rounded-xl border border-border px-3 text-xs text-muted-foreground hover:bg-muted"
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {tasksLoading ? (
                <div className="space-y-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-9 animate-pulse rounded-lg bg-muted" />
                  ))}
                </div>
              ) : tasks.length === 0 && !addingTask ? (
                <p className="text-xs text-muted-foreground py-2">Nenhuma tarefa ainda.</p>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {tasks.map((task: { id: string; title: string; status: TaskStatus; due_date?: string }) => {
                    const config = taskStatusConfig[task.status];
                    const Icon = config.icon;
                    return (
                      <div
                        key={task.id}
                        className="group flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5 hover:bg-muted/50 transition-colors"
                      >
                        <button
                          onClick={() => cycleTaskStatus(task)}
                          className="shrink-0 transition-transform hover:scale-110"
                          title={`Status: ${config.label} — clique para alterar`}
                        >
                          <Icon className={`size-4 ${config.color}`} />
                        </button>
                        <span className={`flex-1 text-sm ${task.status === "DONE" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {task.title}
                        </span>
                        {task.due_date && (
                          <span className="text-xs text-muted-foreground shrink-0">
                            {new Date(task.due_date).toLocaleDateString("pt-BR")}
                          </span>
                        )}
                        <button
                          onClick={() => deleteTaskFn(task.id)}
                          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Criada em{" "}
                {new Date(classItem.created_at).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}