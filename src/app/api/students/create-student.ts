import api from "@/lib/api";

export async function createStudent(data: {
  name: string;
  email?: string;
  phone?: string;
  document?: string;
  status: "ACTIVE" | "INACTIVE" | "PAUSED";
}) {
  const response = await api.post("/students", data);
  return response.data;
}