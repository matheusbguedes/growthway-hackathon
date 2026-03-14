"use client";

import { cn } from "@/lib/utils";
import { ClassStatus } from "@/types/class";
import type { ElementType } from "react";
import {
  CheckCircle2,
  Clock,
  Loader2,
  ShieldCheck,
  XCircle,
} from "lucide-react";

const statusConfig: Record<
  ClassStatus,
  { label: string; icon: ElementType; className: string }
> = {
  pending: {
    label: "Pendente",
    icon: Clock,
    className: "bg-zinc-100 text-zinc-600 border-zinc-200",
  },
  progress: {
    label: "Em andamento",
    icon: Loader2,
    className: "bg-blue-50 text-blue-600 border-blue-200",
  },
  canceled: {
    label: "Cancelada",
    icon: XCircle,
    className: "bg-red-50 text-red-500 border-red-200",
  },
  validation: {
    label: "Aguardando validação",
    icon: ShieldCheck,
    className: "bg-amber-50 text-amber-600 border-amber-200",
  },
  concluded: {
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
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        config.className,
        className
      )}
    >
      <Icon className={cn("size-3", status === "progress" && "animate-spin")} />
      {config.label}
    </span>
  );
}