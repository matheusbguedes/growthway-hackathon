"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mail, MoreHorizontal, Phone, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StudentDeleteDialog } from "./student-delete-modal";

export type Student = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  status: "ACTIVE" | "INACTIVE" | "PAUSED";
  invoices?: { status: string }[];
};

const studentStatusConfig = {
  ACTIVE: { label: "Ativo", color: "bg-green-100 text-green-700" },
  INACTIVE: { label: "Inativo", color: "bg-red-100 text-red-700" },
  PAUSED: { label: "Pausado", color: "bg-zinc-100 text-zinc-600" },
};

const paymentStatusConfig = {
  PAID: { label: "Pago", color: "bg-green-100 text-green-700" },
  PENDING: { label: "Pendente", color: "bg-yellow-100 text-yellow-700" },
  OVERDUE: { label: "Atrasado", color: "bg-red-100 text-red-700" },
  NONE: { label: "Sem cobranças", color: "bg-zinc-100 text-zinc-500" },
};

function getPaymentStatus(invoices?: { status: string }[]) {
  if (!invoices || invoices.length === 0) return "NONE";
  if (invoices.some((i) => i.status === "OVERDUE")) return "OVERDUE";
  if (invoices.some((i) => i.status === "PENDING")) return "PENDING";
  return "PAID";
}

interface StudentCardProps {
  student: Student;
}

export function StudentCard({ student }: StudentCardProps) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const statusConfig = studentStatusConfig[student.status];
  const paymentStatus = getPaymentStatus(student.invoices);
  const paymentConfig = paymentStatusConfig[paymentStatus];

  return (
    <>
      <StudentDeleteDialog
        student={student}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />

      <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-base font-semibold text-zinc-600">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-zinc-800 leading-tight">{student.name}</p>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* DropdownMenuTrigger já renderiza <button>, não colocar Button dentro */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-xl hover:bg-muted transition-colors">
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => router.push(`/student/${student.id}/edit`)}
              >
                <Pencil className="mr-2 size-4" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteOpen(true)}
                className="text-red-500 focus:text-red-500"
              >
                <Trash2 className="mr-2 size-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Contato */}
        <div className="flex flex-col gap-1.5 text-sm text-zinc-500">
          {student.email ? (
            <span className="flex items-center gap-2">
              <Mail className="size-3.5 shrink-0" />
              <span className="truncate">{student.email}</span>
            </span>
          ) : (
            <span className="flex items-center gap-2 text-zinc-300">
              <Mail className="size-3.5 shrink-0" />
              Sem email
            </span>
          )}
          {student.phone ? (
            <span className="flex items-center gap-2">
              <Phone className="size-3.5 shrink-0" />
              {student.phone}
            </span>
          ) : (
            <span className="flex items-center gap-2 text-zinc-300">
              <Phone className="size-3.5 shrink-0" />
              Sem telefone
            </span>
          )}
        </div>

        {/* Footer - pagamento */}
        <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
          <span className="text-xs text-zinc-400">Pagamento</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${paymentConfig.color}`}>
            {paymentConfig.label}
          </span>
        </div>
      </div>
    </>
  );
}