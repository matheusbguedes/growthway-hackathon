import api from "@/lib/api";

export async function deleteClass(id: string) {
  const response = await api.delete(`/classes/${id}`);
  return response.data;
}