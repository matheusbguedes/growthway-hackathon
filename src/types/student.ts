export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  document?: string;
  status: "ACTIVE" | "INACTIVE" | "PAUSED";
  discipline?: string;
  level?: string;
  avatar_url?: string;
  started_at?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentStats {
  total_classes: number;
  concluded_classes: number;
  task_completion_rate: number;
}

export interface StudentGoal {
  id: string;
  title: string;
  description?: string;
  progress: number;
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  start_at: string;
  end_at?: string;
}

export interface NextClass {
  date: string;
  time: string;
  modality: string;
  location?: string;
}