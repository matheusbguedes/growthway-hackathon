"use client";

import { deleteStudent } from "@/app/api/students/delete-student";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Student } from "./student-card";

interface StudentDeleteDialogProps {
  student: Student;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StudentDeleteDialog({
  student,
  open,
  onOpenChange,
}: StudentDeleteDialogProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteStudentFn, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteStudent(student.id),
    onSuccess: () => {
      onOpenChange(false);
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Aluno excluído com sucesso");
    },
    onError: (error: string) => toast.error(error),
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !isDeleting && onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl">
        <h2 className="text-base font-semibold text-zinc-800">Excluir aluno</h2>
        <p className="mt-2 text-sm text-zinc-500">
          Tem certeza que deseja excluir{" "}
          <strong className="text-zinc-700">{student.name}</strong>? Essa ação
          não pode ser desfeita.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
            className="inline-flex h-8 items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => deleteStudentFn()}
            disabled={isDeleting}
            className="inline-flex h-8 items-center justify-center rounded-xl bg-red-500 px-3 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </div>
    </div>
  );
}