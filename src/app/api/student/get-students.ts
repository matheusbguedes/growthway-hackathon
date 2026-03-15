import api from "@/lib/api";
import type { Student } from "@/types/student";

export async function getStudents(): Promise<Student[]> {
  const { data } = await api.get<Student[]>("/students");
  return data;
}
