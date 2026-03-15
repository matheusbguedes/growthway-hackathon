import api from "@/lib/api";

export async function updateTask(
  classId: string,
  taskId: string,
  data: {
    title?: string;
    description?: string;
    status?: "PENDING" | "DONE" | "NOT_DONE" | "PARTIAL";
    due_date?: string;
  }
) {
  const response = await api.put(`/tasks/${classId}/${taskId}`, data);
  return response.data;
}