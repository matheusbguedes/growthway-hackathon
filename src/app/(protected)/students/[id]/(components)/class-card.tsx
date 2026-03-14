"use client";

import { cn } from "@/lib/utils";
import { Class } from "@/types/class";
import { CheckSquare2 } from "lucide-react";
import { ClassStatusBadge } from "./class-status-badge";

interface ClassCardProps {
  classItem: Class;
  onClick: (classItem: Class) => void;
}

function formatCardDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date
    .toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .toUpperCase()
    .replace(".", "");
}

const STATUS_LEFT_BORDER: Record<Class["status"], string> = {
  pending: "border-l-zinc-300",
  progress: "border-l-blue-400",
  canceled: "border-l-red-400",
  validation: "border-l-amber-400",
  concluded: "border-l-primary",
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

      <p className="text-sm font-semibold text-foreground mb-1.5">
        {classItem.title}
      </p>

      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
        {classItem.description}
      </p>

      <div className="flex flex-wrap items-center gap-1.5">
        {classItem.tags.map((tag) => (
          <span
            key={tag.id}
            className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground"
          >
            {tag.name}
          </span>
        ))}
        {classItem.has_task && (
          <span className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            <CheckSquare2 className="size-3" />
            {classItem.task_description
              ? `Tarefa: ${classItem.task_description.slice(0, 24)}${classItem.task_description.length > 24 ? "…" : ""}`
              : "Com atividade"}
          </span>
        )}
      </div>
    </button>
  );
}