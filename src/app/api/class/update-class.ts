import api from "@/lib/api";

export async function updateClass(
  id: string,
  data: {
    date?: string;
    title?: string;
    description?: string;
    status?: "PENDING" | "IN_PROGRESS" | "IN_REVIEW" | "COMPLETED" | "CANCELLED";
    url?: string;
    notes?: string;
    goal_id?: string;
  }
) {
  const response = await api.put(`/classes/${id}`, data);
  return response.data;
}