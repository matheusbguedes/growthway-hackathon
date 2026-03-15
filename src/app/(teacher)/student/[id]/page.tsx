"use client";

import { getStudent } from "@/app/api/student/get-student";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { cn } from "@/lib/utils";
import type { StudentClass } from "@/types/student";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Calendar, CheckSquare2, ChevronRight, Clock, Music2, Plus, Star, Target } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ClassDetailModal } from "./(components)/class-detail-modal";
import { ClassPlanModal } from "./(components)/class-plan-modal";

type DiaryFilter = "all" | "goal";

const statusConfig = {
  COMPLETED: {
    label: "Concluída",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  PENDING: {
    label: "Pendente",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  IN_PROGRESS: {
    label: "Em progresso",
    dot: "bg-primary",
    badge: "bg-primary/10 text-primary border-primary/20",
  },
  IN_REVIEW: {
    label: "Em revisão",
    dot: "bg-blue-400",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
  },
  CANCELLED: {
    label: "Cancelada",
    dot: "bg-rose-400",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
  },
} as const;

export default function StudentProfile() {
  const { id } = useParams<{ id: string }>();
  const [diaryFilter, setDiaryFilter] = useState<DiaryFilter>("all");
  const [expandedClass, setExpandedClass] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<StudentClass | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: student, isLoading } = useQuery({
    queryKey: ["student", id],
    queryFn: () => getStudent(id),
  });

  const initials = useMemo(() => {
    if (!student?.name) return "?";
    return student.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  }, [student]);

  const allClasses = useMemo(() => {
    if (!student?.classes_grouped) return [];
    const withGoal = student.classes_grouped.with_goal.flatMap((group: { classes: StudentClass[] }) => group.classes);
    const withoutGoal = student.classes_grouped.without_goal;
    return [...withGoal, ...withoutGoal].sort(
      (a: StudentClass, b: StudentClass) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [student]);

  const stats = useMemo(() => {
    const total = allClasses.length;
    const completed = allClasses.filter((c: StudentClass) => c.status === "COMPLETED").length;
    return {
      total_classes: total,
      concluded_classes: completed,
      task_completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [allClasses]);

  const goal = useMemo(() => {
    const firstGoalGroup = student?.classes_grouped?.with_goal?.[0];
    if (!firstGoalGroup) return null;
    const totalClasses = firstGoalGroup.classes.length;
    const completedClasses = firstGoalGroup.classes.filter((c: StudentClass) => c.status === "COMPLETED").length;
    const progress = totalClasses > 0 ? Math.round((completedClasses / totalClasses) * 100) : 0;
    return { ...firstGoalGroup.goal, progress };
  }, [student]);

  const filteredClasses = useMemo(() => {
    if (diaryFilter === "goal") return allClasses.filter((c: StudentClass) => c.goal_id);
    return allClasses;
  }, [diaryFilter, allClasses]);

  if (isLoading || !student) {
    return (
      <div className="w-full min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 md:px-8 max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="h-5 bg-muted rounded w-40" />
            <div className="h-40 bg-muted rounded-2xl" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-28 bg-muted rounded-2xl" />
              <div className="h-28 bg-muted rounded-2xl" />
            </div>
            <div className="h-96 bg-muted rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:px-8 max-w-6xl space-y-6">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="absolute -top-16 -right-16 size-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <div className="relative p-6 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-5">
              <Avatar className="size-16 ring-2 ring-border ring-offset-2 ring-offset-card">
                <AvatarImage src={student.avatar_url} alt={student.name} />
                <AvatarFallback className="text-base font-bold bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1.5 min-w-0">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Perfil do Aluno</p>
                <h1 className="text-2xl font-bold text-foreground truncate">{student.name}</h1>
                <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                  {student.discipline && (
                    <span className="flex items-center gap-1.5">
                      <Music2 className="size-3.5" />
                      {student.discipline}
                      {student.level && (
                        <>
                          <span className="text-muted-foreground/50">·</span>
                          {student.level}
                        </>
                      )}
                    </span>
                  )}
                  {student.started_at && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      Desde {new Date(student.started_at).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="lg" className="gap-2 shrink-0">
                <Plus className="size-4" />
                Registrar aula
              </Button>
              <ClassPlanModal />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Aulas realizadas</p>
                <div className="flex items-baseline gap-2">
                  <NumberTicker value={stats.concluded_classes} className="text-4xl font-black text-foreground tabular-nums" />
                  <span className="text-sm text-muted-foreground font-medium">/ {stats.total_classes}</span>
                </div>
                <div className="mt-3 h-1 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700"
                    style={{ width: stats.total_classes > 0 ? `${(stats.concluded_classes / stats.total_classes) * 100}%` : "0%" }}
                  />
                </div>
              </div>
              <div className="shrink-0 rounded-xl border border-primary/20 bg-primary/10 p-2.5">
                <BookOpen className="size-5 text-primary" />
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md hover:shadow-primary/5">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Taxa de conclusão</p>
                <div className="flex items-baseline gap-1">
                  <NumberTicker value={stats.task_completion_rate} className="text-4xl font-black text-foreground tabular-nums" />
                  <span className="text-xl font-bold text-muted-foreground">%</span>
                </div>
              </div>
              <div className="shrink-0 rounded-xl border border-primary/20 bg-primary/10 p-2.5">
                <CheckSquare2 className="size-5 text-primary" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-6 items-start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Diário de aulas</h2>
              <span className="text-xs font-medium text-muted-foreground tabular-nums">
                {filteredClasses.length} {filteredClasses.length === 1 ? "registro" : "registros"}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-muted/60 rounded-xl p-1 w-fit border border-border/50">
              {([
                { key: "all" as const, label: "Todas", icon: BookOpen },
                { key: "goal" as const, label: "Com meta", icon: Target },
              ]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setDiaryFilter(tab.key)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                    diaryFilter === tab.key
                      ? "bg-background text-foreground shadow-sm border border-border/80"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  )}
                >
                  <tab.icon className="size-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              {filteredClasses.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border py-16 text-center bg-muted/20">
                  <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
                    <BookOpen className="size-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {diaryFilter === "goal" ? "Nenhuma aula vinculada à meta." : "Nenhuma aula registrada."}
                  </p>
                </div>
              ) : (
                filteredClasses.map((classItem: StudentClass) => {
                  const config = statusConfig[classItem.status as keyof typeof statusConfig] ?? {
                    label: classItem.status,
                    dot: "bg-muted-foreground",
                    badge: "bg-muted text-muted-foreground border-border",
                  };
                  const isExpanded = expandedClass === classItem.id;
                  const formattedDate = new Date(classItem.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <button
                      key={classItem.id}
                      onClick={() => {
                        setExpandedClass(isExpanded ? null : classItem.id);
                        setSelectedClass(classItem);
                      }}
                      className={cn(
                        "group w-full text-left rounded-xl border bg-card p-4 transition-all duration-200",
                        "hover:shadow-md hover:shadow-black/5 hover:-translate-y-px",
                        isExpanded
                          ? "border-primary/30 shadow-sm shadow-primary/5"
                          : "border-border hover:border-border/80"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("mt-0.5 shrink-0 size-2 rounded-full", config.dot)} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-foreground truncate leading-snug">
                              {classItem.title ?? "Aula sem título"}
                            </p>
                            <div className="flex items-center gap-2 shrink-0">
                              {classItem.goal_id && (
                                <span className="flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wide">
                                  <Target className="size-2.5" />
                                  Meta
                                </span>
                              )}
                              <span className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", config.badge)}>
                                {config.label}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="size-3" />
                              {formattedDate}
                            </span>
                          </div>
                        </div>
                        <ChevronRight
                          className={cn(
                            "size-4 text-muted-foreground shrink-0 transition-transform duration-200",
                            isExpanded && "rotate-90"
                          )}
                        />
                      </div>
                      {isExpanded && classItem.description && (
                        <div className="mt-3 ml-5 pl-3 border-l-2 border-primary/20">
                          <p className="text-sm text-muted-foreground leading-relaxed">{classItem.description}</p>
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="space-y-4 lg:sticky lg:top-6">
            {goal && (
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
                <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
                <div className="relative space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                        <Target className="size-3.5 text-primary" />
                      </div>
                      <span className="text-xs font-bold text-foreground uppercase tracking-widest">Meta atual</span>
                    </div>
                    <span className="text-xs font-bold text-primary tabular-nums">{goal.progress}%</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground leading-snug mb-1">{goal.title}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{goal.description}</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                  <Star className="size-3.5 text-primary" />
                </div>
                <span className="text-xs font-bold text-foreground uppercase tracking-widest">Resumo</span>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Total de aulas", value: stats.total_classes },
                  { label: "Concluídas", value: stats.concluded_classes },
                  { label: "Pendentes", value: stats.total_classes - stats.concluded_classes },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="text-xs font-bold text-foreground tabular-nums">{item.value}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Aproveitamento</span>
                    <span className="text-xs font-bold text-primary tabular-nums">{stats.task_completion_rate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ClassDetailModal
        classItem={selectedClass}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}