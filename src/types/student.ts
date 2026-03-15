export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE" | "PAUSED";
  created_at: string;
  updated_at: string;
}
