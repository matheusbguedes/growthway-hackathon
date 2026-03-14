"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/animate-ui/radix/dialog";
import { Button } from "@/components/ui/button";
import type { StudentClass } from "@/types/student";
import { ExternalLink, Pencil } from "lucide-react";
import { ClassStatusBadge } from "./class-status-badge";

interface ClassDetailModalProps {
  classItem: StudentClass | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
  open,
  onOpenChange,
}: ClassDetailModalProps) {
  if (!classItem) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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

          {classItem.url && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Link da aula
              </span>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => window.open(classItem.url!, "_blank")}
              >
                <ExternalLink className="size-4" />
                Acessar link externo
              </Button>
            </div>
          )}

          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Criada em {new Date(classItem.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}