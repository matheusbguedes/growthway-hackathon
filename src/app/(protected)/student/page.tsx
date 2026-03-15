"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudents } from "@/app/api/students/get-students";
import { StudentCard } from "./components/student-card";
import { StudentCreateModal } from "./components/student-create-modal";
import { StudentSkeleton } from "./components/student-skeleton";
import { Users } from "lucide-react";

export default function StudentsPage() {
  const { data: students, isLoading } = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  if (isLoading) return <StudentSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold md:text-2xl">Alunos</h1>
        <StudentCreateModal />
      </div>

      {students?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-200 bg-white py-16 text-zinc-400">
          <Users className="size-10 opacity-40" />
          <p className="text-sm">Nenhum aluno cadastrado ainda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students?.map((student: any) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
}