import api from "@/lib/api";

export async function deleteTask(classId: string, taskId: string) {
  const response = await api.delete(`/tasks/${classId}/${taskId}`);
  return response.data;
}