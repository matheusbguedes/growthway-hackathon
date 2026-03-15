"use client";

import { getStudent } from "@/app/api/student/get-student";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StudentClass } from "@/types/student";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Calendar, CheckSquare2, ChevronRight, Music2, Plus, Target } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ClassCard } from "./(components)/class-card";
import { ClassDetailModal } from "./(components)/class-detail-modal";

type DiaryFilter = "all" | "goal";

export default function StudentProfile() {
  const { id } = useParams<{ id: string }>();
  const [diaryFilter, setDiaryFilter] = useState<DiaryFilter>("all");
  const [selectedClass, setSelectedClass] = useState<StudentClass | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: student, isLoading } = useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudent(id),
  });

  const handleClassClick = (classItem: StudentClass) => {
    setSelectedClass(classItem);
    setModalOpen(true);
  };

  // Calcular iniciais do nome
  const initials = useMemo(() => {
    if (!student?.name) return "?";
    return student.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [student]);

  // Agregar todas as aulas (com e sem meta)
  const allClasses = useMemo(() => {
    if (!student?.classes_grouped) return [];

    const withGoal = student.classes_grouped.with_goal.flatMap((group) => group.classes);
    const withoutGoal = student.classes_grouped.without_goal;

    return [...withGoal, ...withoutGoal].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [student]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    const total = allClasses.length;
    const completed = allClasses.filter((c) => c.status === "COMPLETED").length;

    return {
      total_classes: total,
      concluded_classes: completed,
      task_completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [allClasses]);

  // Pegar a primeira meta (se houver)
  const goal = useMemo(() => {
    const firstGoalGroup = student?.classes_grouped?.with_goal?.[0];
    if (!firstGoalGroup) return null;

    const totalClasses = firstGoalGroup.classes.length;
    const completedClasses = firstGoalGroup.classes.filter((c) => c.status === "COMPLETED").length;
    const progress = totalClasses > 0 ? Math.round((completedClasses / totalClasses) * 100) : 0;

    return {
      ...firstGoalGroup.goal,
      progress,
    };
  }, [student]);

  // Filtrar aulas com base no filtro selecionado
  const filteredClasses = useMemo(() => {
    if (diaryFilter === "goal") {
      return allClasses.filter((c) => c.goal_id !== null);
    }
    return allClasses;
  }, [diaryFilter, allClasses]);

  if (isLoading || !student) {
    return (
      <div className="container mx-auto px-6 py-6 md:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-6 md:px-8 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/students" className="hover:text-foreground transition-colors">
          Alunos
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground font-medium">{student.name}</span>
      </nav>

      {/* Header do aluno */}
      <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Avatar className="size-20 rounded-xl">
            <AvatarImage src={student.avatar_url} alt={student.name} />
            <AvatarFallback className="rounded-xl text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-bold text-foreground">
              {student.name}
            </h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
              {student.discipline && (
                <span className="flex items-center gap-1.5">
                  <Music2 className="size-3.5" />
                  {student.discipline}
                  {student.level && (
                    <>
                      <span className="text-muted-foreground/60">•</span>
                      {student.level}
                    </>
                  )}
                </span>
              )}
              {student.started_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  Início: {new Date(student.started_at).toLocaleDateString("pt-BR")}
                </span>
              )}
            </div>
          </div>
        </div>
        <Button size="lg" className="gap-2 shrink-0">
          <Plus className="size-4" />
          Registrar aula
        </Button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Aulas realizadas
            </p>
            <p className="text-3xl font-bold text-foreground">
              {stats.concluded_classes}
              <span className="text-base font-normal text-muted-foreground ml-1.5">
                / {stats.total_classes} total
              </span>
            </p>
          </div>
          <div className="rounded-xl bg-primary/10 p-2.5">
            <BookOpen className="size-5 text-primary" />
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Taxa de conclusão
            </p>
            <p className="text-3xl font-bold text-foreground">
              {stats.task_completion_rate}
              <span className="text-base font-normal text-muted-foreground ml-0.5">%</span>
            </p>
          </div>
          <div className="rounded-xl bg-amber-500/10 p-2.5">
            <CheckSquare2 className="size-5 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* Coluna esquerda - Diário de aulas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Diário de aulas
            </h2>
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-1 bg-muted rounded-xl p-1 w-fit">
            {[
              { key: "all" as const, label: "Todas as aulas" },
              { key: "goal" as const, label: "Vinculadas à meta" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setDiaryFilter(tab.key)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  diaryFilter === tab.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Lista de aulas */}
          <div className="flex flex-col gap-3">
            {filteredClasses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  {diaryFilter === "goal"
                    ? "Nenhuma aula vinculada à meta."
                    : "Nenhuma aula registrada."}
                </p>
              </div>
            ) : (
              filteredClasses.map((classItem) => (
                <ClassCard
                  key={classItem.id}
                  classItem={classItem}
                  onClick={handleClassClick}
                />
              ))
            )}
          </div>
        </div>

        {/* Coluna direita - Meta e próxima aula */}
        <div className="space-y-4">
          {/* Card de meta */}
          {goal && (
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Target className="size-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  Meta atual
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">
                {goal.title}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                {goal.description}
              </p>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground uppercase tracking-wide font-medium">
                    Progresso
                  </span>
                  <span className="font-semibold text-primary">
                    {goal.progress}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalhes da aula */}
      <ClassDetailModal
        classItem={selectedClass}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}