"use client";

import { getDashboard } from "@/app/api/dashboard/get-dashboard";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CheckCircle, CircleDashed, Users2 } from "lucide-react";
import { Card } from "./(components)/card";

const STUDENT_STATUS_COLORS: Record<string, string> = {
  ACTIVE: "#1D9E75", // green
  PAUSED: "#FACC15", // yellow
  INACTIVE: "#9CA3AF", // gray
};

const CLASS_STATUS_COLORS: Record<string, string> = {
  COMPLETED: "#22C55E", // emerald
  PENDING: "#FACC15", // yellow
  CANCELLED: "#EF4444", // red
  IN_PROGRESS: "#3B82F6", // blue
  IN_REVIEW: "#A855F7", // purple
};

const STUDENT_STATUS_LABELS_PT: Record<string, string> = {
  ACTIVE: "Ativo",
  PAUSED: "Pausado",
  INACTIVE: "Inativo",
};

const CLASS_STATUS_LABELS_PT: Record<string, string> = {
  COMPLETED: "Concluída",
  PENDING: "Pendente",
  CANCELLED: "Cancelada",
  IN_PROGRESS: "Em andamento",
  IN_REVIEW: "Em revisão",
};

export default function Dashboard() {
  const { data: dashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
  });

  const studentStatusData = dashboard?.charts.student_status ?? [];
  const classesStatusData = dashboard?.charts.classes_status ?? [];

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
          Olá João, muito bom ter você por aqui!
        </h1>
        <p className="text-sm text-zinc-500">
          Aqui está o que está acontecendo com suas aulas hoje.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card
          icon={Users2}
          label="Total de Alunos"
          value={dashboard?.metrics.total_students.toString() || "0"}
        />
        <Card
          icon={CheckCircle}
          label="Aulas concluídas"
          value={dashboard?.metrics.completed_classes.toString() || "0"}
        />
        <Card
          icon={CircleDashed}
          label="Aulas pendentes"
          value={dashboard?.metrics.pending_classes.toString() || "0"}
        />
      </div>

      <div className="grid flex-1 gap-4 md:grid-cols-2 items-stretch">
        {/* Student status donut chart */}
        <div className="flex flex-col rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Status dos alunos
            </h2>
          </div>
          <div className="h-72 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    borderColor: "#E5E7EB",
                  }}
                />
                <Pie
                  data={studentStatusData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  strokeWidth={0}
                  isAnimationActive
                  animationDuration={700}
                  animationBegin={0}
                >
                  {studentStatusData.map((entry, index) => (
                    <Cell
                      // eslint-disable-next-line react/no-array-index-key
                      key={`slice-${index}`}
                      fill={STUDENT_STATUS_COLORS[entry.label] ?? "#E5E7EB"}
                    />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value: string) => (
                    <span className="text-xs text-muted-foreground">
                      {STUDENT_STATUS_LABELS_PT[value] ?? value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Classes status horizontal bar chart */}
        <div className="flex flex-col rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground">
              Status das aulas
            </h2>
          </div>
          <div className="h-72 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={classesStatusData}
                layout="vertical"
                margin={{ top: 8, right: 16, bottom: 8, left: 16 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  className="stroke-border/60"
                />
                <XAxis type="number" tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="status"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value: string) =>
                    CLASS_STATUS_LABELS_PT[value] ?? value
                  }
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    borderColor: "#E5E7EB",
                  }}
                />
                <Bar
                  dataKey="count"
                  radius={6}
                  barSize={16}
                  isAnimationActive
                  animationDuration={700}
                  animationBegin={0}
                >
                  {classesStatusData.map((entry, index) => (
                    <Cell
                      // eslint-disable-next-line react/no-array-index-key
                      key={`bar-${index}`}
                      fill={CLASS_STATUS_COLORS[entry.status] ?? "var(--chart-2)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}