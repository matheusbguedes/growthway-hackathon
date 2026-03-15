export interface Student {
  id: string;
  name: string;
  email: string;
<<<<<<< HEAD
  phone: string | null;
  document?: string | null;
  status: "ACTIVE" | "INACTIVE" | "PAUSED";
  discipline?: string;
  level?: string;
  avatar_url?: string;
  started_at?: string;
=======
  phone: string;
  status: "ACTIVE" | "INACTIVE" | "PAUSED";
>>>>>>> main
  created_at: string;
  updated_at: string;
  user_id: string;
  classes_grouped?: {
    with_goal: Array<{
      goal: {
        id: string;
        title: string;
        description: string;
        status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
      };
      classes: StudentClass[];
    }>;
    without_goal: StudentClass[];
  };
}

export interface StudentClass {
  id: string;
  date: string;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "IN_REVIEW" | "COMPLETED" | "CANCELLED";
  url: string | null;
  notes: string | null;
  created_at: string;
  goal_id: string | null;
  goal: {
    id: string;
    title: string;
    description: string;
    status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  } | null;
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