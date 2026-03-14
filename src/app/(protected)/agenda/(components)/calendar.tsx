"use client";

import { getClasses } from "@/app/api/class/get-classes";
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/animate-ui/radix/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Class } from "@/types/class";
import { useQuery } from "@tanstack/react-query";
import {
    addDays,
    differenceInDays,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    isToday,
    startOfMonth,
    startOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeftIcon, ChevronRightIcon, Circle } from "lucide-react";
import { useState } from "react";

export default function Calendar() {
    const { data: classes = [], isLoading } = useQuery({
        queryKey: ["classes"],
        queryFn: getClasses,
        refetchOnWindowFocus: true,
    });

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [baseDate, setBaseDate] = useState(new Date());

    const startDay = startOfWeek(startOfMonth(baseDate));
    const endDay = endOfWeek(endOfMonth(baseDate));

    const days = Array.from(
        { length: differenceInDays(endDay, startDay) + 1 },
        (_, i) => {
            const day = addDays(startDay, i);
            return day;
        }
    ).filter(Boolean);

    const weekdays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

    const addMonth = (date: Date, amount: number) => {
        const newDate = new Date(date);
        newDate.setMonth(date.getMonth() + amount);
        return newDate;
    };

    return (
        <div className="container flex flex-col gap-2 mb-8">
            <div className="w-full flex items-center justify-between gap-4">
                <Button
                    size="icon"
                    variant="outline"
                    className="text-primary hover:text-primary/80"
                    onClick={() => setBaseDate(addMonth(baseDate, -1))}
                >
                    <ChevronLeftIcon className="size-4" />
                </Button>
                <h1 className="text-sm text-muted-foreground capitalize">
                    {format(baseDate, "MMMM", { locale: ptBR })}
                </h1>
                <Button
                    size="icon"
                    variant="outline"
                    className="text-primary hover:text-primary/80"
                    onClick={() => setBaseDate(addMonth(baseDate, 1))}
                >
                    <ChevronRightIcon className="size-4" />
                </Button>
            </div>
            <div className="w-full grid grid-cols-7 border border-border rounded-lg">
                {weekdays.map((day, index) => (
                    <div
                        key={index}
                        className="flex justify-center items-center py-4 border-b border-border text-sm font-medium text-muted-foreground"
                    >
                        {day}
                    </div>
                ))}
                {days.map((day, index) => {
                    const isCurrentMonth = isSameMonth(day!, baseDate);
                    const isSelected = format(day!, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");

                    const dayClasses = classes?.filter((classItem: Class) =>
                        isSameDay(new Date(classItem.date), day!)
                    );

                    return (
                        <Dialog key={index}>
                            <DialogTrigger asChild>
                                <div
                                    className={cn(
                                        "h-28 p-4 text-right border border-border cursor-pointer transition-all duration-300",
                                        "hover:bg-primary/5 hover:border-primary/30",
                                        isSelected && "bg-primary/10 border-primary/60",
                                        isCurrentMonth ? "text-foreground" : "text-muted-foreground opacity-50"
                                    )}
                                    onClick={() => setSelectedDate(day!)}
                                >
                                    {/* days */}
                                    {isToday(day!) ? (
                                        <div className="w-full inline-flex justify-end">
                                            <span className="size-10 flex justify-center items-center p-1 rounded-full font-medium text-primary border-2 border-primary">
                                                {format(day!, "dd")}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col justify-center items-center gap-2">
                                            <span className="w-full inline-flex justify-end">
                                                {format(day!, "dd")}
                                            </span>
                                        </div>
                                    )}
                                    {/* schedules */}
                                    {dayClasses.slice(0, 2).map(({ id, title }: Class) => (
                                        <div
                                            key={id}
                                            className="w-full flex items-center gap-2 truncate"
                                        >
                                            <Circle
                                                className="size-2 text-primary"
                                                fill="currentColor"
                                            />
                                            <span className="w-full text-sm text-muted-foreground line-clamp-1 text-ellipsis text-left">
                                                {title ? title : "Sem título"}
                                            </span>
                                        </div>
                                    ))}
                                    {dayClasses.length > 2 && (
                                        <div className="w-full flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                            <span className="text-sm text-primary font-medium">
                                                + {dayClasses.length - 2}{" "}
                                                {dayClasses.length - 2 > 1
                                                    ? "aulas"
                                                    : "aula"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                            </DialogContent>
                        </Dialog>
                    );
                })}
            </div>
        </div>
    );
}