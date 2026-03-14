import api from "@/lib/api";
import type { Student } from "@/types/student";

export async function getStudent(id: string): Promise<Student> {
  const { data } = await api.get<Student>(`/students/${id}`);
  return data;
}
