"use client";

import { CalendarDays, TrendingUp, Users } from "lucide-react";
import { Card } from "./(components)/card";

export default function Dashboard() {
  return (
    <div className="container mx-auto px-6 py-6 md:px-8 space-y-5 border border-border rounded-xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card
          icon={Users}
          label="Total de Alunos"
          value="128"
          trend={12}
        />
        <Card
          icon={CalendarDays}
          label="Aulas Esta Semana"
          value="24"
          trend={-2}
        />
        <Card
          icon={TrendingUp}
          label="Progresso Médio"
          value="85%"
          trend={5}
        />
      </div>
    </div>
  );
}