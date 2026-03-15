"use client";

import { cn } from "@/lib/utils";
import type { StudentClass } from "@/types/student";
import { CheckSquare2, ExternalLink } from "lucide-react";
import { ClassStatusBadge } from "./class-status-badge";

interface ClassCardProps {
  classItem: StudentClass;
  onClick: (classItem: StudentClass) => void;
}

function formatCardDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date
    .toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase()
    .replace(".", "");
}

const STATUS_LEFT_BORDER: Record<StudentClass["status"], string> = {
  PENDING: "border-l-zinc-300",
  IN_PROGRESS: "border-l-blue-400",
  CANCELLED: "border-l-red-400",
  IN_REVIEW: "border-l-amber-400",
  COMPLETED: "border-l-primary",
};

export function ClassCard({ classItem, onClick }: ClassCardProps) {
  const formattedDate = formatCardDate(classItem.date);

  return (
    <button
      onClick={() => onClick(classItem)}
      className={cn(
        "w-full text-left rounded-xl border border-border bg-card px-5 py-4 transition-colors hover:bg-muted/50 border-l-4",
        STATUS_LEFT_BORDER[classItem.status]
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className="text-xs font-medium text-muted-foreground">
          {formattedDate}
        </span>
        <ClassStatusBadge status={classItem.status} />
      </div>

      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-sm font-semibold text-foreground">
          {classItem.title}
        </p>
        {classItem.url && (
          <ExternalLink className="size-3.5 text-muted-foreground shrink-0" />
        )}
      </div>

      {classItem.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {classItem.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        {classItem.goal && (
          <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            🎯 {classItem.goal.title}
          </span>
        )}
        {classItem.notes && (
          <span className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            <CheckSquare2 className="size-3" />
            Com observações
          </span>
        )}
      </div>
    </button>
  );
}