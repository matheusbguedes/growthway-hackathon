import { StudentStatus } from "@/enums/student-status";
import api from "@/lib/api";

export async function updateStudent(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    document?: string;
    status?: StudentStatus;
  }
) {
  const response = await api.put(`/students/${id}`, data);
  return response.data;
}