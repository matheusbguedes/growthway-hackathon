import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; className: string }> = {
        PENDING: { label: "pendente", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
        IN_PROGRESS: { label: "em andamento", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
        IN_REVIEW: { label: "em revisão", className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" },
        COMPLETED: { label: "concluída", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
        CANCELLED: { label: "cancelado", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
    }

    const { label, className } = map[status] ?? { label: status, className: "bg-muted text-muted-foreground" }

    return (
        <span className={cn("text-[11px] font-medium px-2 py-0.5 rounded shrink-0", className)}>
            {label}
        </span>
    )
}