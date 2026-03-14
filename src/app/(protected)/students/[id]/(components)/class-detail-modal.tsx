"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/radix/dialog";
import { Class } from "@/types/class";
import { CheckSquare2, Pencil, Square } from "lucide-react";
import { ClassStatusBadge } from "./class-status-badge";

interface ClassDetailModalProps {
  classItem: Class | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDatePtBR(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function ClassDetailModal({
  classItem,
  open,
  onOpenChange,
}: ClassDetailModalProps) {
  if (!classItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          fixed
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-full
          max-w-lg
          max-h-[90vh]
          overflow-y-auto
          z-50
        "
      >
        <DialogHeader>
          <div className="flex items-start justify-between gap-3 pr-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {formatDatePtBR(classItem.date)}
              </span>
              <DialogTitle className="text-lg font-semibold leading-snug">
                {classItem.title}
              </DialogTitle>
            </div>
            <button
              className="mt-1 shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Editar aula"
            >
              <Pencil className="size-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Status
            </span>
            <ClassStatusBadge status={classItem.status} />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Conteúdo da aula
            </span>
            <p className="text-sm text-foreground leading-relaxed">
              {classItem.description}
            </p>
          </div>

          {classItem.tags.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {classItem.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Atividade
            </span>
            <div className="flex items-start gap-2">
              {classItem.has_task ? (
                <>
                  <CheckSquare2 className="mt-0.5 size-4 shrink-0 text-primary" />
                  <p className="text-sm text-foreground leading-relaxed">
                    {classItem.task_description ?? "Atividade registrada."}
                  </p>
                </>
              ) : (
                <>
                  <Square className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Nenhuma atividade para esta aula.
                  </p>
                </>
              )}
            </div>
          </div>

          {classItem.goal_id && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5">
              <p className="text-xs font-medium text-primary">
                🎯 Esta aula está vinculada à meta atual do aluno
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}