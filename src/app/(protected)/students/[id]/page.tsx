"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Class } from "@/types/class";
import { StudentGoal, StudentStats, NextClass, Student } from "@/types/student";
import {
  BookOpen,
  Calendar,
  CheckSquare2,
  ChevronRight,
  MapPin,
  Music2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ClassCard } from "./(components)/class-card";
import { ClassDetailModal } from "./(components)/class-detail-modal";

type DiaryFilter = "all" | "goal";

// TODO: substituir por useQuery quando integrar com o back
// const { data: student }  = useQuery({ queryKey: ["student", id], queryFn: () => getStudent(id) })
// const { data: stats }    = useQuery({ queryKey: ["student-stats", id], queryFn: () => getStudentStats(id) })
// const { data: goal }     = useQuery({ queryKey: ["student-goal", id], queryFn: () => getStudentGoal(id) })
// const { data: classes }  = useQuery({ queryKey: ["student-classes", id], queryFn: () => getStudentClasses(id) })
// const { data: nextClass } = useQuery({ queryKey: ["student-next-class", id], queryFn: () => getStudentNextClass(id) })

export default function StudentProfile() {
  const { id } = useParams<{ id: string }>();

  const [diaryFilter, setDiaryFilter] = useState<DiaryFilter>("all");
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [modalOpen, setModalOpen] = useState(false);


const student = null as Student | null;
const stats = null as StudentStats | null;
const goal = null as StudentGoal | null;
const nextClass = null as NextClass | null;
const classes: Class[] = [];

  const filteredClasses =
    diaryFilter === "goal"
      ? classes.filter((c) => c.goal_id !== null)
      : classes;

  function handleClassClick(classItem: Class) {
    setSelectedClass(classItem);
    setModalOpen(true);
  }

  const initials = student?.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() ?? "?";

  if (!student) {
    return (
      <div className="px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link href="/students" className="hover:text-foreground transition-colors">
            Alunos
          </Link>
          <ChevronRight className="size-3.5" />
          <div className="h-4 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="rounded-2xl border border-border bg-card px-6 py-5 mb-6 h-28 animate-pulse" />
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl border border-border bg-card px-5 py-4 h-24 animate-pulse" />
          <div className="rounded-2xl border border-border bg-card px-5 py-4 h-24 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-8 py-6 max-w-7xl mx-auto">
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link href="/students" className="hover:text-foreground transition-colors">
            Alunos
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground font-medium">{student.name}</span>
        </nav>

        <div className="rounded-2xl border border-border bg-card px-6 py-5 mb-6 flex items-center justify-between gap-4">
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
                    Início:{" "}
                    {new Date(student.started_at).toLocaleDateString("pt-BR")}
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

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl border border-border bg-card px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Aulas realizadas
              </p>
              <p className="text-3xl font-bold text-foreground">
                {stats?.concluded_classes ?? "—"}
                <span className="text-base font-normal text-muted-foreground ml-1.5">
                  / {stats?.total_classes ?? "—"} total
                </span>
              </p>
            </div>
            <div className="rounded-xl bg-primary/10 p-2.5">
              <BookOpen className="size-5 text-primary" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Tarefas cumpridas
              </p>
              <p className="text-3xl font-bold text-foreground">
                {stats?.task_completion_rate ?? "—"}
                {stats && (
                  <span className="text-base font-normal text-muted-foreground ml-0.5">
                    %
                  </span>
                )}
              </p>
            </div>
            <div className="rounded-xl bg-amber-100 p-2.5">
              <CheckSquare2 className="size-5 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_300px] gap-6 items-start">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-foreground">
                Diário de aulas
              </h2>
              <button className="text-sm font-medium text-primary hover:underline">
                Ver tudo
              </button>
            </div>

            <div className="flex items-center gap-1 bg-muted rounded-xl p-1 w-fit mb-4">
              {(
                [
                  { key: "all", label: "Todas as aulas" },
                  { key: "goal", label: "Meta" },
                ] as { key: DiaryFilter; label: string }[]
              ).map((tab) => (
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

          <div className="flex flex-col gap-4">
            {goal && (
              <div className="rounded-2xl border border-border bg-card px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">🎯</span>
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

            {nextClass && (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="size-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Próxima aula
                  </span>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {nextClass.date.split(",")[0]}
                </p>
                <p className="text-sm font-semibold text-primary mb-3">
                  {nextClass.date.split(",")[1]?.trim()} • {nextClass.time}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-primary inline-block" />
                  <MapPin className="size-3" />
                  {nextClass.modality}
                  {nextClass.location && ` — ${nextClass.location}`}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ClassDetailModal
        classItem={selectedClass}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}