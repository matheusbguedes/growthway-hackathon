import api from "@/lib/api";

export async function getStudent(id: string) {
  const response = await api.get(`/students/${id}`);
  return response.data;
}