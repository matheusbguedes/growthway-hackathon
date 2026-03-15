import api from "@/lib/api";

export interface GoalClass {
    id: string;
    date: string;
    title: string;
    description: string;
    status: string;
    goal_id: string;
}


export interface ClassPlanResponse {
    goal: {
        id: string;
        title: string;
        description: string;
        status: string;
        start_at: string;
    };
    classes: GoalClass[];
}

export async function createClassPlan(payload: {
    student_id: string;
    title: string;
    approach_description: string;
}): Promise<ClassPlanResponse> {
    const response = await api.post("/ai/class-plan", payload);
    return response.data;
}