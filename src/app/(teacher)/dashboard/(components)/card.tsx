import { LucideIcon } from "lucide-react";

interface CardProps {
    icon: LucideIcon;
    label: string;
    value: string;
}

export function Card({ icon: Icon, label, value }: CardProps) {
    return (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
                <div className="size-11 rounded-xl flex items-center justify-center bg-primary/10">
                    <Icon className="size-5 text-primary" />
                </div>
            </div>
            <div>
                <p className="text-sm text-[#6B7280] mb-0.5">{label}</p>
                <p className="text-2xl font-bold text-[#1A1F36] tracking-tight">{value}</p>
            </div>
        </div>
    );
}
