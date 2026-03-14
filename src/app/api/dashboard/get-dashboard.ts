import api from "@/lib/api";
import { Dashboard } from "@/types/dashboard";

export async function getDashboard(): Promise<Dashboard> {
  const { data } = await api.get<Dashboard>("/dashboard");
  return data;
}
