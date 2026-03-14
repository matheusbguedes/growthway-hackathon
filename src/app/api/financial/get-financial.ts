import api from "@/lib/api";
import { Financial } from "@/types/financial";

export async function getFinancial() {
  const response = await api.get<Financial[]>("/financial");
  return response.data;
}
