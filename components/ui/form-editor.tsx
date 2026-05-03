"use client";

import {
    AlignLeft,
    CheckSquare,
    ChevronDown,
    ChevronUp,
    Circle,
    LayoutTemplate,
    Loader2,
    Lock,
    Plus,
    Save,
    SlidersHorizontal,
    Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useState } from "react";
import { Control, useFieldArray, useForm, UseFormRegister } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
    ChoiceQuestion,
    FeedbackQuestion,
    FormEditorValues,
    QuestionType,
    SliderQuestion,
    TextQuestion,
} from "@/types/feedback";

const CONTROLS: { type: QuestionType; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
        type: "radio",
        label: "Radio",
        desc: "Single choice",
        icon: <Circle className="size-4" />,
        color: "bg-violet-100 text-violet-700 border-violet-200",
    },
    {
        type: "checkbox",
        label: "Checkbox",
        desc: "Multi choice",
        icon: <CheckSquare className="size-4" />,
        color: "bg-sky-100 text-sky-700 border-sky-200",
    },
    {
        type: "slider",
        label: "Rating",
        desc: "Fixed 1–5 scale",
        icon: <SlidersHorizontal className="size-4" />,
        color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    {
        type: "text_input",
        label: "Text",
        desc: "Open answer",
        icon: <AlignLeft className="size-4" />,
        color: "bg-amber-100 text-amber-700 border-amber-200",
    },
];

const TYPE_COLOR: Record<QuestionType, string> = {
    radio: "bg-violet-50 text-violet-700 border-violet-200",
    checkbox: "bg-sky-50 text-sky-700 border-sky-200",
    slider: "bg-emerald-50 text-emerald-700 border-emerald-200",
    text_input: "bg-amber-50 text-amber-700 border-amber-200",
};

const MANDATORY_QUESTIONS: FeedbackQuestion[] = [
    {
        id: "mandatory-rating",
        type: "slider",
        questionText: "How would you rate your overall experience today? (1-Very Unsatisfied to 5-Very Satisfied)",
        required: true,
        order: 998,
        maxRating: 5,
        isMandatory: true,
    } as SliderQuestion,
    {
        id: "mandatory-comment",
        type: "text_input",
        questionText: "Please share any additional feedback or suggestions you have for us.",
        required: true,
        order: 999,
        placeholder: "Tell us what you loved or what we could do better...",
        isMandatory: true,
    } as TextQuestion,
];

interface OptionsEditorProps {
    nest: `questions.${number}`;
    control: Control<FormEditorValues>;
    register: UseFormRegister<FormEditorValues>;
    type: "radio" | "checkbox";
    readOnly: boolean;
}

function OptionsEditor({ nest, control, register, type, readOnly }: OptionsEditorProps) {
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: `${nest}.options` as const as `questions.${number}.options`,
    });

    return (
        <div className="space-y-2 mt-3 pl-4 border-l-2 border-slate-100">
            {fields.map((item, i) => (
                <div key={item.id} className="flex items-center gap-3 group/option">
                    <div
                        className={cn(
                            "shrink-0 size-4 border-2 border-slate-300",
                            type === "radio" ? "rounded-full" : "rounded-md",
                        )}
                    />

                    <Input
                        {...register(`${nest}.options.${i}.label` as const as `questions.${number}.options.${number}.label`)}
                        disabled={readOnly}
                        placeholder="Option text"
                        className="h-9 !text-base font-heading"
                    />

                    {!readOnly && (
                        <div className="flex items-center gap-1 opacity-0 group-hover/option:opacity-100 transition-opacity">
                            <button
                                type="button"
                                onClick={() => move(i, i - 1)}
                                disabled={i === 0}
                                className="text-slate-400 hover:text-[#7B55A3] disabled:opacity-30 cursor-pointer"
                            >
                                <ChevronUp size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => move(i, i + 1)}
                                disabled={i === fields.length - 1}
                                className="text-slate-400 hover:text-[#7B55A3] disabled:opacity-30 cursor-pointer"
                            >
                                <ChevronDown size={14} />
                            </button>
                            <button
                                type="button"
                                onClick={() => remove(i)}
                                className="text-slate-400 hover:text-red-500 ml-1 cursor-pointer"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    )}
                </div>
            ))}
            {!readOnly && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => append({ id: crypto.randomUUID(), label: "" })}
                    className="text-[#7B55A3] h-7 text-base px-2 hover:bg-[#7B55A3]/90 hover:text-white font-heading"
                >
                    <Plus size={12} className="mr-1" /> Add option
                </Button>
            )}
        </div>
    );
}

interface FeedbackFormEditorProps {
    initialData?: FormEditorValues | null;
    readOnly?: boolean;
    onSave?: (data: FormEditorValues, isDirty: boolean) => void;
    onClose?: () => void;
}

export default function FeedbackFormEditor({ initialData, readOnly = false, onSave, onClose }: FeedbackFormEditorProps) {
    const [activeTab, setActiveTab] = useState(readOnly ? "preview" : "editor");
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<FormEditorValues>({
        defaultValues: initialData || {
            title: "New Feedback Form",
            questions: [...MANDATORY_QUESTIONS],
        },
    });

    const { fields, remove, move, prepend } = useFieldArray({
        control: form.control,
        name: "questions",
    });

    const handleAddQuestion = useCallback(
        (type: QuestionType) => {
            const base = {
                id: crypto.randomUUID(),
                questionText: "",
                required: true,
                order: 0,
                isMandatory: false,
            };

            let newObj: FeedbackQuestion;
            if (type === "radio" || type === "checkbox") {
                newObj = { ...base, type, options: [{ id: crypto.randomUUID(), label: "" }] } as ChoiceQuestion;
            } else if (type === "slider") {
                newObj = { ...base, type, maxRating: 5 } as SliderQuestion;
            } else {
                newObj = { ...base, type, placeholder: "Write your answer..." } as TextQuestion;
            }

            prepend(newObj);
        },
        [prepend],
    );

    const handleRemove = (index: number) => {
        remove(index);
    };

    const handleFormSubmit = async (data: FormEditorValues) => {
        if (readOnly) return;
        setIsSaving(true);

        try {
            if (onSave) await onSave(data, form.formState.isDirty);
        } catch (e) {
        } finally {
            setIsSaving(false);
        }
    };

    const watchedQuestions = form.watch("questions") || [];
    const watchedTitle = form.watch("title");

    return (
        <div className="flex h-screen flex-col bg-white overflow-hidden font-sans">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <header className="shrink-0 border-b border-slate-100 bg-white px-6 py-3 flex items-center justify-between z-50">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="size-9 rounded-xl bg-[#7B55A3] flex items-center justify-center text-white shadow-lg">
                            <LayoutTemplate size={20} />
                        </div>
                        <input
                            {...form.register("title")}
                            disabled={readOnly}
                            className="text-xl font-bold font-heading bg-transparent outline-none w-[600px] border-none focus:ring-0 disabled:opacity-70"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <TabsList className="bg-slate-100 p-1 rounded-xl">
                            {!readOnly && (
                                <TabsTrigger
                                    value="editor"
                                    className="rounded-lg font-heading font-semibold text-base px-6 data-[state=active]:bg-white cursor-pointer"
                                >
                                    Editor
                                </TabsTrigger>
                            )}
                            <TabsTrigger
                                value="preview"
                                className="rounded-lg font-heading font-semibold text-base px-6 data-[state=active]:bg-white cursor-pointer"
                            >
                                Preview
                            </TabsTrigger>
                        </TabsList>
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="text-slate-500 hover:bg-slate-100 rounded-xl text-base px-5 font-semibold cursor-pointer"
                        >
                            {readOnly ? "Close" : "Cancel"}
                        </Button>
                        {!readOnly && (
                            <Button
                                onClick={form.handleSubmit(handleFormSubmit)}
                                disabled={isSaving}
                                className="bg-[#7B55A3] hover:bg-[#7B55A3]/90 text-white text-base rounded-xl h-10 px-5 font-bold shadow-lg gap-2 cursor-pointer"
                            >
                                {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save size={18} />} Save Form
                            </Button>
                        )}
                    </div>
                </header>

                {activeTab === "editor" && (
                    <div className="flex-1 flex overflow-hidden">
                        <TabsContent value="editor" className="flex-1 flex overflow-hidden m-0 outline-none">
                            {!readOnly && (
                                <aside className="w-64 shrink-0 border-r-2 border-[#5C5C5C]/10 bg-slate-100/50 p-5 flex flex-col gap-3 overflow-y-auto">
                                    <p className="text-sm font-black text-slate-600 uppercase tracking-widest px-1">
                                        Add Element
                                    </p>
                                    {CONTROLS.map((ctrl) => (
                                        <button
                                            key={ctrl.type}
                                            onClick={() => handleAddQuestion(ctrl.type)}
                                            className="flex items-center gap-3 bg-white border-2 border-slate-200 rounded-xl p-3 text-left hover:border-[#7B55A3] transition-all group active:scale-95 cursor-pointer"
                                        >
                                            <span
                                                className={cn(
                                                    "size-8 rounded-lg flex items-center justify-center border",
                                                    ctrl.color,
                                                )}
                                            >
                                                {ctrl.icon}
                                            </span>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700 group-hover:text-[#7B55A3]">
                                                    {ctrl.label}
                                                </p>
                                                <p className="text-xs text-slate-400">{ctrl.desc}</p>
                                            </div>
                                        </button>
                                    ))}
                                </aside>
                            )}

                            <main className="flex-1 overflow-y-auto p-8 bg-[#FAFAFB]">
                                <div className="max-w-3xl mx-auto space-y-4 pb-20">
                                    <AnimatePresence mode="popLayout">
                                        {fields.map((field, index) => {
                                            const q = field as unknown as FeedbackQuestion;
                                            return (
                                                <motion.div
                                                    key={field.id}
                                                    layout
                                                    initial={{ opacity: 0, y: 15 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-white border-3 border-[#7B55A3] rounded-[20px] p-6 shadow-sm group relative"
                                                >
                                                    {!readOnly && (
                                                        <div className="absolute -left-12 top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-full bg-white shadow-sm border border-slate-200 hover:text-[#7B55A3]"
                                                                disabled={index === 0}
                                                                onClick={() => move(index, index - 1)}
                                                            >
                                                                <ChevronUp size={18} />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 rounded-full bg-white shadow-sm border border-slate-200 hover:text-[#7B55A3]"
                                                                disabled={index === fields.length - 1}
                                                                onClick={() => move(index, index + 1)}
                                                            >
                                                                <ChevronDown size={18} />
                                                            </Button>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <Badge
                                                                variant="outline"
                                                                className={cn(
                                                                    "border-2 rounded-full px-3 py-1 text-[12px] font-bold",
                                                                    TYPE_COLOR[q.type],
                                                                )}
                                                            >
                                                                {q.type.toUpperCase()}
                                                            </Badge>
                                                            {q.isMandatory && (
                                                                <Badge className="bg-slate-900 text-white border-none rounded-full flex gap-1 items-center text-[10px]">
                                                                    <Lock size={10} /> REQUIRED
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        {!q.isMandatory && !readOnly && (
                                                            <button
                                                                onClick={() => handleRemove(index)}
                                                                className="text-slate-400 hover:text-red-500 cursor-pointer"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <Input
                                                        {...form.register(`questions.${index}.questionText`)}
                                                        placeholder="Enter question text..."
                                                        readOnly={readOnly || q.isMandatory}
                                                        className={cn(
                                                            "!text-lg font-bold border-0 border-b border-slate-100 rounded-none px-0 focus-visible:ring-0 mb-4 bg-transparent shadow-none",
                                                            q.isMandatory && "opacity-60 cursor-default",
                                                        )}
                                                    />

                                                    {(q.type === "radio" || q.type === "checkbox") && (
                                                        <OptionsEditor
                                                            nest={`questions.${index}`}
                                                            control={form.control}
                                                            register={form.register}
                                                            type={q.type}
                                                            readOnly={readOnly}
                                                        />
                                                    )}
                                                    {q.type === "slider" && (
                                                        <div className="py-4 text-center bg-slate-50 border-2 border-dashed border-slate-100 rounded-xl">
                                                            <p className="text-base font-bold text-slate-400 uppercase">
                                                                Fixed Rating Scale: 1 — 5
                                                            </p>
                                                        </div>
                                                    )}
                                                    {q.type === "text_input" && !q.isMandatory && (
                                                        <div className="ml-4">
                                                            <Label className="text-sm font-bold text-slate-400 uppercase">
                                                                Placeholder
                                                            </Label>
                                                            <Input
                                                                {...form.register(
                                                                    `questions.${index}.placeholder` as const as `questions.${number}.placeholder`,
                                                                )}
                                                                readOnly={readOnly}
                                                                className="h-8 !text-base mt-2"
                                                            />
                                                        </div>
                                                    )}
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            </main>
                        </TabsContent>
                    </div>
                )}

                <TabsContent value="preview" className="flex-1 bg-slate-50 overflow-y-auto p-10 pb-27 outline-none">
                    <div className="max-w-2xl mx-auto space-y-8 pb-32">
                        <div className="border-b border-slate-200 pb-6">
                            <h1 className="text-4xl font-bold text-[#261A36] tracking-tight break-words">{watchedTitle}</h1>
                        </div>
                        <AnimatePresence>
                            {watchedQuestions.map((q, i) => (
                                <motion.div
                                    key={q.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white border-3 border-[#7B55A3] rounded-[20px] p-6 shadow-sm"
                                >
                                    <span className="text-xs font-bold text-[#3C2457] tracking-widest mb-2 block uppercase">
                                        Question {i + 1}
                                    </span>
                                    <h3
                                        className={cn(
                                            "text-lg font-bold text-[#444444] leading-tight",
                                            q.type === "slider" ? "mb-4" : "mb-2",
                                        )}
                                    >
                                        {q.questionText || "Untitled Question"}
                                    </h3>
                                    {(q.type === "radio" || q.type === "checkbox") &&
                                        (q as ChoiceQuestion).options?.map((o) => (
                                            <div
                                                key={o.id}
                                                className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl mb-2 bg-slate-50/50"
                                            >
                                                <div
                                                    className={cn(
                                                        "size-4 border-2 border-slate-300",
                                                        q.type === "radio" ? "rounded-full" : "rounded-md",
                                                    )}
                                                />
                                                {o.label || "Untitled Option"}
                                            </div>
                                        ))}
                                    {q.type === "slider" && (
                                        <div className="pt-2">
                                            <Slider
                                                defaultValue={[3]}
                                                max={5}
                                                min={1}
                                                step={1}
                                                disabled
                                                className="opacity-100"
                                            />
                                            <div className="flex justify-between mt-2 text-xs font-bold text-slate-400 px-1">
                                                <span>1</span>
                                                <span>2</span>
                                                <span>3</span>
                                                <span>4</span>
                                                <span>5</span>
                                            </div>
                                        </div>
                                    )}
                                    {q.type === "text_input" && (
                                        <Input
                                            disabled
                                            placeholder={(q as TextQuestion).placeholder}
                                            className="h-12 rounded-xl !text-base bg-slate-50 mt-2"
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
