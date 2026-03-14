export type ClassStatus =
  | "pending"
  | "progress"
  | "canceled"
  | "validation"
  | "concluded";

export interface ClassTag {
  id: string;
  name: string;
}

export interface Class {
  id: string;
  date: string;
  title: string;
  description: string;
  status: ClassStatus;
  goal_id: string | null;
  has_task: boolean;
  task_description?: string | null;
  tags: ClassTag[];
  created_at: string;
  updated_at: string;
}