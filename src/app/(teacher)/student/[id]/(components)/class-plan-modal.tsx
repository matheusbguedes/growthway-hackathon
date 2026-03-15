"use client";

import { ClassPlanResponse, createClassPlan } from "@/app/api/ai/create-class-plan";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/animate-ui/radix/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Sparkles,
    Target,
    X
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    title: z
        .string()
        .min(5, "O título deve ter pelo menos 5 caracteres.")
        .max(120, "O título deve ter no máximo 120 caracteres."),
    approach_description: z
        .string()
        .min(10, "Descreva melhor a abordagem (mínimo 10 caracteres).")
        .max(600, "Máximo de 600 caracteres."),
});

type FormValues = z.infer<typeof schema>;

const statusMap: Record<string, { label: string; dot: string }> = {
    COMPLETED: { label: "Concluída", dot: "bg-emerald-500" },
    PENDING: { label: "Pendente", dot: "bg-amber-400" },
    IN_PROGRESS: { label: "Em progresso", dot: "bg-primary" },
    CANCELLED: { label: "Cancelada", dot: "bg-rose-400" },
};

const stagger = {
    visible: { transition: { staggerChildren: 0.06 } },
};

const itemFade = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

type Step = "form" | "loading" | "success";

export function ClassPlanModal() {
    const { id: studentId } = useParams<{ id: string }>();
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<Step>("form");
    const [result, setResult] = useState<ClassPlanResponse | null>(null);
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { title: "", approach_description: "" },
    });

    const approachLen = watch("approach_description")?.length ?? 0;

    const mutation = useMutation({
        mutationFn: createClassPlan,
        onSuccess: (data) => {
            setResult(data);
            setStep("success");
            queryClient.invalidateQueries({ queryKey: ["student", studentId] });
        },
        onError: () => {
            setStep("form");
        },
    });

    const onSubmit = (values: FormValues) => {
        setStep("loading");
        mutation.mutate({
            student_id: studentId,
            title: values.title,
            approach_description: values.approach_description,
        });
    };

    const handleClose = (next: boolean) => {
        if (!next) {
            setOpen(false);
            setTimeout(() => {
                setStep("form");
                setResult(null);
                reset();
            }, 300);
        } else {
            setOpen(next);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogTrigger asChild>
                <Button size="lg" className="gap-2 shrink-0">
                    <Sparkles className="size-4" />
                    Plano de aulas com IA
                </Button>
            </DialogTrigger>

            <DialogContent className="p-0 gap-0 overflow-hidden max-w-lg w-full rounded-2xl border border-border bg-card shadow-xl shadow-black/10 focus:outline-none">
                <DialogTitle className="sr-only">Criar plano de aulas</DialogTitle>

                <AnimatePresence mode="wait">

                    {step === "form" && (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="relative overflow-hidden px-6 pt-6 pb-5 border-b border-border">
                                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute -top-10 -right-10 size-32 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
                                <div className="relative flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                                            <Sparkles className="size-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">IA</p>
                                            <h2 className="text-base font-bold text-foreground leading-tight">Gerar plano de aulas</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                        Objetivo da meta
                                    </label>
                                    <input
                                        {...register("title")}
                                        placeholder="Ex: Dominar conjugação verbal no presente"
                                        className={cn(
                                            "w-full rounded-xl border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60",
                                            "outline-none ring-0 transition-all duration-150",
                                            "focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
                                            errors.title ? "border-rose-400 focus:border-rose-400 focus:ring-rose-200" : "border-border"
                                        )}
                                    />
                                    <AnimatePresence>
                                        {errors.title && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex items-center gap-1.5 text-xs text-rose-500 font-medium overflow-hidden"
                                            >
                                                <AlertCircle className="size-3 shrink-0" />
                                                {errors.title.message}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                            Abordagem pedagógica
                                        </label>
                                        <span className={cn(
                                            "text-[11px] tabular-nums font-medium transition-colors",
                                            approachLen > 550 ? "text-rose-500" : "text-muted-foreground"
                                        )}>
                                            {approachLen}/600
                                        </span>
                                    </div>
                                    <textarea
                                        {...register("approach_description")}
                                        rows={4}
                                        placeholder="Ex: Aulas expositivas com exercícios escritos e orais; priorizar verbos regulares antes dos irregulares."
                                        className={cn(
                                            "w-full resize-none rounded-xl border bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60",
                                            "outline-none ring-0 transition-all duration-150 leading-relaxed",
                                            "focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
                                            errors.approach_description ? "border-rose-400 focus:border-rose-400 focus:ring-rose-200" : "border-border"
                                        )}
                                    />
                                    <AnimatePresence>
                                        {errors.approach_description && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="flex items-center gap-1.5 text-xs text-rose-500 font-medium overflow-hidden"
                                            >
                                                <AlertCircle className="size-3 shrink-0" />
                                                {errors.approach_description.message}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="flex items-center gap-3 pt-1">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1 rounded-xl"
                                        onClick={() => handleClose(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" className="flex-1 rounded-xl gap-2">
                                        <Sparkles className="size-4" />
                                        Gerar plano
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {step === "loading" && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col items-center justify-center gap-5 px-6 py-16"
                        >
                            <div className="flex size-16 items-center justify-center">
                                <Sparkles className="size-12 text-primary animate-pulse" />
                            </div>
                            <div className="text-center space-y-1">
                                <p className="text-sm font-bold text-foreground">Gerando plano de aulas...</p>
                                <p className="text-xs text-muted-foreground">A IA está criando as aulas com base na abordagem definida.</p>
                            </div>
                        </motion.div>
                    )}

                    {step === "success" && result && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="relative overflow-hidden px-6 pt-6 pb-5 border-b border-border">
                                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
                                <div className="absolute -top-10 -right-10 size-32 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
                                <div className="relative flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                                            className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 shrink-0"
                                        >
                                            <CheckCircle2 className="size-4 text-emerald-600" />
                                        </motion.div>
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-0.5">Criado com sucesso</p>
                                            <h2 className="text-base font-bold text-foreground leading-tight">Plano de aulas gerado!</h2>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleClose(false)}
                                        className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                    >
                                        <X className="size-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.15 }}
                                    className="relative overflow-hidden rounded-xl border border-border bg-card p-4"
                                >
                                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
                                    <div className="relative flex items-start gap-3">
                                        <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shrink-0 mt-0.5">
                                            <Target className="size-3.5 text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Meta criada</p>
                                            <p className="text-sm font-bold text-foreground leading-snug">{result.goal.title}</p>
                                            <p className="text-xs text-muted-foreground leading-relaxed mt-1">{result.goal.description}</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                            Aulas geradas
                                        </p>
                                        <span className="text-xs font-semibold text-primary tabular-nums">
                                            {result.classes.length} aulas
                                        </span>
                                    </div>

                                    <motion.div
                                        variants={stagger}
                                        initial="hidden"
                                        animate="visible"
                                        className="flex flex-col gap-2"
                                    >
                                        {result.classes.map((cls, i) => {
                                            const status = statusMap[cls.status] ?? { label: cls.status, dot: "bg-muted-foreground" };
                                            const date = new Date(cls.date).toLocaleDateString("pt-BR", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            });

                                            return (
                                                <motion.div
                                                    key={cls.id}
                                                    variants={{ itemFade }}
                                                    className="rounded-xl border border-border bg-background p-3.5"
                                                >
                                                    <div className="flex items-start gap-2.5">
                                                        <div className="flex size-5 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-muted-foreground shrink-0 mt-0.5 tabular-nums">
                                                            {i + 1}
                                                        </div>
                                                        <div className="flex-1 min-w-0 space-y-1">
                                                            <p className="text-sm font-semibold text-foreground leading-snug">{cls.title}</p>
                                                            <p className="text-xs text-muted-foreground leading-relaxed">{cls.description}</p>
                                                            <div className="flex items-center gap-3 pt-0.5">
                                                                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                                    <Calendar className="size-3" />
                                                                    {date}
                                                                </span>
                                                                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                                                    <div className={cn("size-1.5 rounded-full", status.dot)} />
                                                                    {status.label}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </motion.div>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-border">
                                <Button className="w-full rounded-xl gap-2" onClick={() => handleClose(false)}>
                                    <CheckCircle2 className="size-4" />
                                    Perfeito, fechar
                                </Button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </DialogContent>
        </Dialog>
    );
}