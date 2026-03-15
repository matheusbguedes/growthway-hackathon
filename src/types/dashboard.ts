export interface Dashboard {
  metrics: {
    total_students: number;
    completed_classes: number;
    pending_classes: number;
  };
  charts: {
    student_status: {
      label: string;
      value: number;
    }[];
    classes_status: {
      status: string;
      count: number;
    }[];
  };
}
