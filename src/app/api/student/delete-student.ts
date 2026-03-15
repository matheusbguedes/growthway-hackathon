import api from "@/lib/api";

export async function deleteStudent(id: string) {
  const response = await api.delete(`/students/${id}`);
  return response.data;
}