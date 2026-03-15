import api from "@/lib/api";

export async function createClass(data: {
  student_id: string;
  date?: string;
  title?: string;
  description: string;
  status?: "PENDING" | "IN_PROGRESS" | "IN_REVIEW" | "COMPLETED" | "CANCELLED";
  url?: string;
  notes?: string;
  goal_id?: string;
}) {
  const response = await api.post("/classes", data);
  return response.data;
}