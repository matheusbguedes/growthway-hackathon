"use client";

import { getDashboard } from "@/app/api/dashboard/get-dashboard";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, CircleDashed, Users2 } from "lucide-react";
import { Card } from "./(components)/card";

export default function Dashboard() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    refetchOnWindowFocus: true,
  });

  return (
    <div className="container mx-auto px-6 py-6 md:px-8 space-y-5 border border-border rounded-xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card
          icon={Users2}
          label="Total de Alunos"
          value={dashboard?.total_students.toString() || "0"}
        />
        <Card
          icon={CheckCircle}
          label="Aulas concluídas"
          value={dashboard?.completed_classes.toString() || "0"}
        />
        <Card
          icon={CircleDashed}
          label="Aulas pendentes"
          value={dashboard?.pending_classes.toString() || "0"}
        />
      </div>
    </div>
  );
}