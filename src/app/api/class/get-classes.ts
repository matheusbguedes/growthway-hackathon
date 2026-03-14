import api from "@/lib/api";
import type { Class } from "@/types/class";

export async function getClasses(): Promise<Class[]> {
  const { data } = await api.get<Class[]>("/classes");
  return data;
}
