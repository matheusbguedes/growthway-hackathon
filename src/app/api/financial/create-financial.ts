import api from "@/lib/api";
import { Financial } from "@/types/financial";

export type CreateFinancialPayload = Pick<Financial, "amount" | "type" | "status">;

export async function createFinancial(data: CreateFinancialPayload) {
  const response = await api.post<Financial>("/financial", data);
  return response.data;
}
