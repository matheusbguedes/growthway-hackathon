import { ClassStatus } from "@/enums/class-status";

export type Class = {
  id: string;
  date: Date;
  title?: string;
  description?: string;
  status: ClassStatus;
  url?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  user?: {
    id: string;
    name: string;
  };
  student?: {
    id: string;
    name: string;
  };
  goal?: {
    id: string;
    title: string;
  };
};
