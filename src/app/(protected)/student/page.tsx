"use client";

import { getStudents } from "@/app/api/student/get-students";
import { Student as StudentType } from "@/types/student";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { StudentCard } from "./components/student-card";
import { StudentCreateModal } from "./components/student-create-modal";
import { StudentSkeleton } from "./components/student-skeleton";

export default function Student() {
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

      {!students || students.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-200 bg-white py-16 text-zinc-400">
          <Users className="size-10 opacity-40" />
          <p className="text-sm">Nenhum aluno cadastrado ainda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((student: StudentType) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}
    </div>
  );
}