"use client";

import { cn } from "@/lib/utils";
import type { StudentClass } from "@/types/student";
import {
  CheckCircle2,
  Clock,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import type { ElementType } from "react";

type ClassStatus = StudentClass["status"];

const statusConfig: Record<
  ClassStatus,
  { label: string; icon: ElementType; className: string }
> = {
  PENDING: {
    label: "Pendente",
    icon: Clock,
    className: "bg-zinc-100 text-zinc-600 border-zinc-200",
  },
  IN_PROGRESS: {
    label: "Em andamento",
    icon: Loader2,
    className: "bg-blue-50 text-blue-600 border-blue-200",
  },
  CANCELLED: {
    label: "Cancelada",
    icon: XCircle,
    className: "bg-red-50 text-red-500 border-red-200",
  },
  IN_REVIEW: {
    label: "Em revisão",
    icon: ShieldCheck,
    className: "bg-amber-50 text-amber-600 border-amber-200",
  },
  COMPLETED: {
    label: "Concluída",
    icon: CheckCircle2,
    className: "bg-green-50 text-green-600 border-green-200",
  },
};

interface ClassStatusBadgeProps {
  status: ClassStatus;
  className?: string;
}

export function ClassStatusBadge({ status, className }: ClassStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "w-fit inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      <Icon className={cn("size-3", status === "IN_PROGRESS" && "animate-spin")} />
      {config.label}
    </span>
  );
}