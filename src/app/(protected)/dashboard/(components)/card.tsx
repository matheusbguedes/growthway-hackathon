import { cn } from "@/lib/utils";
import { LucideIcon, TrendingDown, TrendingUp } from "lucide-react";

interface CardProps {
    icon: LucideIcon;
    label: string;
    value: string;
    trend: number;
}

export function Card({ icon: Icon, label, value, trend }: CardProps) {
    const isPositive = trend >= 0;
    return (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between">
                <div className="size-11 rounded-xl flex items-center justify-center bg-primary/10">
                    <Icon className="size-5 text-primary" />
                </div>
                <span
                    className={cn(
                        "flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full",
                        isPositive ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"
                    )}
                >
                    {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    {isPositive ? "+" : ""}
                    {trend}%
                </span>
            </div>
            <div>
                <p className="text-sm text-[#6B7280] mb-0.5">{label}</p>
                <p className="text-2xl font-bold text-[#1A1F36] tracking-tight">{value}</p>
            </div>
        </div>
    );
}
