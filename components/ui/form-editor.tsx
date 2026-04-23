'use client';

import React, { useState, useCallback } from 'react';
import { useForm, useFieldArray} from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import {
    Plus, Trash2, Circle, SlidersHorizontal,
    AlignLeft, LayoutTemplate, CheckSquare, Download
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NotificationToast, ToastVariant } from '@/components/ui/notification-toast';
import {cn} from "@/lib/utils";
import {ChoiceQuestion, FeedbackQuestion, QuestionType, SliderQuestion, TextQuestion} from '@/types/feedback';

export interface FormEditorValues {
    title: string;
    questions: FeedbackQuestion[];
}

const CONTROLS: { type: QuestionType; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    { type: 'radio',      label: 'Radio',      desc: 'Single choice',    icon: <Circle className="size-4" />,          color: 'bg-violet-100 text-violet-700 border-violet-200' },
    { type: 'checkbox',   label: 'Checkbox',   desc: 'Multi choice',     icon: <CheckSquare className="size-4" />,     color: 'bg-sky-100 text-sky-700 border-sky-200' },
    { type: 'slider',     label: 'Slider',     desc: 'Rating 1–5',        icon: <SlidersHorizontal className="size-4" />, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    { type: 'text_input', label: 'Text',       desc: 'Open answer',      icon: <AlignLeft className="size-4" />,       color: 'bg-amber-100 text-amber-700 border-amber-200' },
];

const TYPE_COLOR: Record<QuestionType, string> = {
    radio:      'bg-violet-50 text-violet-700 border-violet-200',
    checkbox:   'bg-sky-50 text-sky-700 border-sky-200',
    slider:     'bg-emerald-50 text-emerald-700 border-emerald-200',
    text_input: 'bg-amber-50 text-amber-700 border-amber-200',
};

function OptionsEditor({ nest, control, register, type }: { nest: string; control: any; register: any; type: 'radio' | 'checkbox' }) {
    const { fields, append, remove } = useFieldArray({ control, name: `${nest}.options` });
    return (
        <div className="space-y-2 mt-3 pl-4 border-l-2 border-slate-100">
            {fields.map((item, i) => (
                <div key={item.id} className="flex items-center gap-3 group">
                    <div className={`shrink-0 size-4 rounded-${type === 'radio' ? 'full' : 'md'} border-2 border-slate-300`} />
                    <Input {...register(`${nest}.options.${i}.label`)} placeholder="Option text" className="h-9 text-sm" />
                    <button type="button" onClick={() => remove(i)} className="text-slate-300 hover:text-rose-500"><Trash2 size={14}/></button>
                </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={() => append({ id: crypto.randomUUID(), label: '' })} className="text-violet-600 h-7 text-xs px-2">
                <Plus size={12} className="mr-1"/> Add option
            </Button>
        </div>
    );
}

export default function FeedbackFormEditor() {
    const [toast, setToast] = useState({ isOpen: false, title: '', description: '', variant: 'success' as ToastVariant });
    const [activeTab, setActiveTab] = useState('editor');

    const form = useForm<FormEditorValues>({
        defaultValues: { title: 'New Feedback Form', questions: [] }
    });

    const { fields, append, remove } = useFieldArray({ control: form.control, name: 'questions' });

    const handleAddQuestion = useCallback((type: QuestionType) => {
        const base = {
            id: crypto.randomUUID(),
            questionText: '',
            required: true,
            order: fields.length
        };

        if (type === 'radio' || type === 'checkbox') {
            append({
                ...base,
                type,
                options: [{ id: crypto.randomUUID(), label: '' }]
            } as ChoiceQuestion);
        }
        else if (type === 'slider') {
            append({
                ...base,
                type,
                minLabel: 'Low',
                maxLabel: 'High',
                maxRating: 5
            } as SliderQuestion);
        }
        else if (type === 'text_input') {
            append({
                ...base,
                type,
                placeholder: 'Write your answer...'
            } as TextQuestion);
        }
    }, [fields.length, append]);

    const exportJSON = (data: FormEditorValues) => {
        if (!data.questions.length) {
            setToast({ isOpen: true, title: "Empty Form", description: "Add some questions before exporting.", variant: "warning" });
            return;
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.title.toLowerCase().replace(/\s+/g, '-')}-schema.json`;
        link.click();

        setToast({ isOpen: true, title: "Exported!", description: "JSON schema downloaded for mobile sync.", variant: "success" });
    };

    const watchedQuestions = form.watch('questions');
    const watchedTitle = form.watch('title');

    return (
        <div className="flex h-screen flex-col bg-white overflow-hidden font-sans">
            <NotificationToast
                isOpen={toast.isOpen}
                onClose={() => setToast(p => ({ ...p, isOpen: false }))}
                title={toast.title}
                description={toast.description}
                variant={toast.variant}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <header className="shrink-0 border-b border-slate-100 bg-white px-6 py-3 flex items-center justify-between z-50">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="size-9 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-200">
                            <LayoutTemplate size={20} />
                        </div>
                        <input {...form.register('title')} className="text-xl font-bold bg-transparent outline-none w-full border-none" />
                    </div>

                    <div className="flex items-center gap-4">
                        <TabsList className="bg-slate-100 p-1 rounded-xl">
                            <TabsTrigger value="editor" className="rounded-lg font-semibold text-sm px-6">Editor</TabsTrigger>
                            <TabsTrigger value="preview" className="rounded-lg font-semibold text-sm px-6">Preview</TabsTrigger>
                        </TabsList>
                        <Button onClick={form.handleSubmit(exportJSON)} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-10 px-6 font-bold shadow-lg shadow-violet-100">
                            <Download size={18} className="mr-2" /> Export JSON
                        </Button>
                    </div>
                </header>

                <TabsContent value="editor" className="flex-1 flex overflow-hidden m-0 outline-none">
                    <aside className="w-64 shrink-0 border-r border-slate-50 bg-slate-50/50 p-5 flex flex-col gap-3 overflow-y-auto">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Controls</p>
                        {CONTROLS.map(ctrl => (
                            <button key={ctrl.type} onClick={() => handleAddQuestion(ctrl.type)} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 text-left hover:border-violet-300 transition-all hover:shadow-sm group">
                                <span className={`size-8 rounded-lg flex items-center justify-center border ${ctrl.color}`}>{ctrl.icon}</span>
                                <div>
                                    <p className="text-xs font-bold text-slate-700 group-hover:text-violet-700">{ctrl.label}</p>
                                    <p className="text-[10px] text-slate-400">{ctrl.desc}</p>
                                </div>
                            </button>
                        ))}
                    </aside>

                    <main className="flex-1 overflow-y-auto p-8 bg-[#FAFAFB]">
                        <div className="max-w-3xl mx-auto space-y-4 pb-20">
                            <AnimatePresence mode="popLayout">
                                {fields.map((field, index) => (
                                    <motion.div key={field.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm group relative">
                                        <div className="flex items-center justify-between mb-4">
                                            <Badge variant="outline" className={cn("rounded-full px-3 py-1", TYPE_COLOR[field.type as QuestionType])}>
                                                {field.type.replace('_', ' ').toUpperCase()}
                                            </Badge>
                                            <button onClick={() => remove(index)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={18}/></button>
                                        </div>
                                        <Input {...form.register(`questions.${index}.questionText` as const)} placeholder="Enter question text..." className="text-lg font-bold border-0 border-b border-slate-100 rounded-none px-0 focus-visible:ring-0 mb-4 bg-transparent" />

                                        {(field.type === 'radio' || field.type === 'checkbox') && <OptionsEditor nest={`questions.${index}`} control={form.control} register={form.register} type={field.type} />}
                                        {field.type === 'slider' && (
                                            <div className="flex gap-4 ml-4">
                                                <div className="flex-1"><Label className="text-[10px] font-bold text-slate-400 uppercase">Min Label</Label><Input {...form.register(`questions.${index}.minLabel` as any)} className="h-8 text-sm mt-1" /></div>
                                                <div className="flex-1"><Label className="text-[10px] font-bold text-slate-400 uppercase">Max Label</Label><Input {...form.register(`questions.${index}.maxLabel` as any)} className="h-8 text-sm mt-1" /></div>
                                            </div>
                                        )}
                                        {field.type === 'text_input' && (
                                            <div className="ml-4"><Label className="text-[10px] font-bold text-slate-400 uppercase">Input Placeholder</Label><Input {...form.register(`questions.${index}.placeholder` as any)} className="h-8 text-sm mt-1" /></div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </main>
                </TabsContent>

                <TabsContent value="preview" className="flex-1 bg-slate-50 overflow-y-auto p-10 outline-none">
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{watchedTitle}</h1>
                            <p className="text-slate-400 mt-2 font-medium">{watchedQuestions.length} Questions Total</p>
                        </div>
                        {watchedQuestions.map((q, i) => (
                            <div key={q.id} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-800 mb-6">{q.questionText || "Untitled Question"}</h3>
                                {q.type === 'radio' && q.options?.map(o => (
                                    <div key={o.id} className="flex items-center gap-3 p-4 border border-slate-100 rounded-xl mb-2 bg-slate-50/30 text-slate-600 font-semibold text-sm">
                                        <div className="size-4 rounded-full border-2 border-slate-300" /> {o.label || "Empty Option"}
                                    </div>
                                ))}
                                {q.type === 'slider' && (
                                    <div className="pt-4 space-y-6">
                                        <Slider defaultValue={[3]} max={5} min={1} step={1} />
                                        <div className="flex justify-between text-xs font-bold text-slate-400 px-1">
                                            <span>{q.minLabel}</span><span>{q.maxLabel}</span>
                                        </div>
                                    </div>
                                )}
                                {q.type === 'text_input' && <Input disabled placeholder={q.placeholder} className="h-12 rounded-xl bg-slate-50" />}
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
