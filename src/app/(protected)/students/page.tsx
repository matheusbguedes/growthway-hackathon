"use client";

import { getStudents } from "@/app/api/student/get-students";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { format, isValid, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";

function formatDate(value: string | Date | null | undefined): string {
  if (value == null) return "-";
  try {
    const date = typeof value === "string" ? parseISO(value) : value;
    return isValid(date) ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "-";
  } catch {
    return "-";
  }
}

export default function Students() {
  const { data: students, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
    refetchOnWindowFocus: true,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold md:text-2xl">Alunos</h1>
      <div className="rounded-lg border border-border">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6">Nome</TableHead>
                <TableHead className="px-6">E-mail</TableHead>
                <TableHead className="px-6">Telefone</TableHead>
                <TableHead className="px-6">Cadastrado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students?.length ? (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="px-6 font-medium">
                      {student.name}
                    </TableCell>
                    <TableCell className="px-6 text-muted-foreground">
                      {student.email}
                    </TableCell>
                    <TableCell className="px-6">{student.phone}</TableCell>
                    <TableCell className="px-6 text-muted-foreground">
                      {formatDate(student.created_at)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    Nenhum aluno cadastrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
