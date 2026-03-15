import api from "@/lib/api";

export async function createTask(
  classId: string,
  data: {
    title: string;
    description?: string;
    status?: "PENDING" | "DONE" | "NOT_DONE" | "PARTIAL";
    due_date?: string;
  }
) {
  const response = await api.post(`/tasks/${classId}`, data);
  return response.data;
}