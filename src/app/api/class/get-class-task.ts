import api from "@/lib/api";

export async function getClassTask(classId: string) {
  const response = await api.get(`/tasks/${classId}`);
  return response.data;
}