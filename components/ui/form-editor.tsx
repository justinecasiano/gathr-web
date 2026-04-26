'use client';

import React, {useState, useCallback} from 'react';
import {useForm, useFieldArray} from 'react-hook-form';
import {motion, AnimatePresence} from 'motion/react';
import {
    Plus, Trash2, Circle, SlidersHorizontal,
    AlignLeft, LayoutTemplate, CheckSquare, Download,
    Loader2, Lock
} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Slider} from '@/components/ui/slider';
import {Badge} from '@/components/ui/badge';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {NotificationToast, ToastVariant} from '@/components/ui/notification-toast';
import {cn} from "@/lib/utils";
import {
    ChoiceQuestion,
    FeedbackQuestion,
    FormEditorValues,
    QuestionType,
    SliderQuestion,
    TextQuestion
} from '@/types/feedback';

const CONTROLS: { type: QuestionType; label: string; desc: string; icon: React.ReactNode; color: string }[] = [
    {
        type: 'radio',
        label: 'Radio',
        desc: 'Single choice',
        icon: <Circle className="size-4"/>,
        color: 'bg-violet-100 text-violet-700 border-violet-200'
    },
    {
        type: 'checkbox',
        label: 'Checkbox',
        desc: 'Multi choice',
        icon: <CheckSquare className="size-4"/>,
        color: 'bg-sky-100 text-sky-700 border-sky-200'
    },
    {
        type: 'slider',
        label: 'Rating',
        desc: 'Fixed 1–5 scale',
        icon: <SlidersHorizontal className="size-4"/>,
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    {
        type: 'text_input',
        label: 'Text',
        desc: 'Open answer',
        icon: <AlignLeft className="size-4"/>,
        color: 'bg-amber-100 text-amber-700 border-amber-200'
    },
];

const TYPE_COLOR: Record<QuestionType, string> = {
    radio: 'bg-violet-50 text-violet-700 border-violet-200',
    checkbox: 'bg-sky-50 text-sky-700 border-sky-200',
    slider: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    text_input: 'bg-amber-50 text-amber-700 border-amber-200',
};

const MANDATORY_QUESTIONS: FeedbackQuestion[] = [
    {
        id: 'mandatory-rating',
        type: 'slider',
        questionText: 'How would you rate your overall experience today? (1-Very Unsatisfied to 5-Very Satisfied',
        required: true,
        order: 998,
        maxRating: 5,
        isMandatory: true
    } as any,
    {
        id: 'mandatory-comment',
        type: 'text_input',
        questionText: 'Please share any additional feedback or suggestions you have for us.',
        required: true,
        order: 999,
        placeholder: 'Tell us what you loved or what we could do better...',
        isMandatory: true
    } as any
];

function OptionsEditor({nest, control, register, type}: {
    nest: string;
    control: any;
    register: any;
    type: 'radio' | 'checkbox'
}) {
    const {fields, append, remove} = useFieldArray({control, name: `${nest}.options`});
    return (
        <div className="space-y-2 mt-3 pl-4 border-l-2 border-slate-100">
            {fields.map((item, i) => (
                <div key={item.id} className="flex items-center gap-3 group">
                    <div
                        className={`shrink-0 size-4 rounded-${type === 'radio' ? 'full' : 'md'} border-2 border-slate-300`}/>
                    <Input {...register(`${nest}.options.${i}.label`)} placeholder="Option text"
                           className="h-9 text-sm font-heading"/>
                    <button type="button" onClick={() => remove(i)}
                            className="text-slate-400 hover:text-[#C44E52] transition-colors cursor-pointer"><Trash2 size={14}/>
                    </button>
                </div>
            ))}
            <Button type="button" variant="ghost" size="sm" onClick={() => append({id: crypto.randomUUID(), label: ''})}
                    className="text-[#7B55A3] h-7 text-xs px-2 hover:bg-[#7B55A3]/90 hover:text-white font-heading">
                <Plus size={12} className="mr-1"/> Add option
            </Button>
        </div>
    );
}

export default function FeedbackFormEditor() {
    const [toast, setToast] = useState({isOpen: false, title: '', description: '', variant: 'success' as ToastVariant});
    const [activeTab, setActiveTab] = useState('editor');
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<FormEditorValues>({
        defaultValues: {
            title: 'New Feedback Form',
            questions: [...MANDATORY_QUESTIONS]
        }
    });

    const {fields, remove} = useFieldArray({control: form.control, name: 'questions'});

    const handleAddQuestion = useCallback((type: QuestionType) => {
        const current = form.getValues('questions');
        const insertIndex = current.length - 2;

        const base = {
            id: crypto.randomUUID(),
            questionText: '',
            required: true,
            order: insertIndex
        };

        let newObj: FeedbackQuestion;

        if (type === 'radio' || type === 'checkbox') {
            newObj = {...base, type, options: [{id: crypto.randomUUID(), label: ''}]} as ChoiceQuestion;
        } else if (type === 'slider') {
            newObj = {...base, type, maxRating: 5} as SliderQuestion;
        } else {
            newObj = {...base, type, placeholder: 'Write your answer...'} as TextQuestion;
        }

        const updated = [
            ...current.slice(0, insertIndex),
            newObj,
            ...current.slice(insertIndex)
        ];

        form.setValue('questions', updated);
    }, [form]);

    const handleRemove = (index: number) => {
        const question = fields[index] as any;
        if (question.isMandatory) {
            setToast({
                isOpen: true,
                title: "Action Restricted",
                description: "This question is required and cannot be removed.",
                variant: "warning"
            });
            return;
        }
        remove(index);
    };

    const exportJSON = (data: FormEditorValues) => {
        setIsSaving(true);
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.title.toLowerCase().replace(/\s+/g, '-')}-schema.json`;
        link.click();

        setTimeout(() => {
            setIsSaving(false);
            setToast({
                isOpen: true,
                title: "Exported Successfully",
                description: "JSON schema downloaded.",
                variant: "success"
            });
        }, 800);
    };

    const watchedQuestions = form.watch('questions') || [];
    const watchedTitle = form.watch('title');

    return (
        <div className="flex h-screen flex-col bg-white overflow-hidden font-sans">
            <NotificationToast
                isOpen={toast.isOpen}
                onClose={() => setToast(p => ({...p, isOpen: false}))}
                title={toast.title}
                description={toast.description}
                variant={toast.variant}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                <header
                    className="shrink-0 border-b border-slate-100 bg-white px-6 py-3 flex items-center justify-between z-50">
                    <div className="flex items-center gap-4 flex-1">
                        <div
                            className="size-9 rounded-xl bg-[#7B55A3] flex items-center justify-center text-white shadow-lg shadow-violet-200">
                            <LayoutTemplate size={20}/>
                        </div>
                        <input {...form.register('title')}
                               className="text-xl font-bold font-heading bg-transparent outline-none w-full border-none focus:ring-0"/>
                    </div>

                    <div className="flex items-center gap-4">
                        <TabsList className="bg-slate-100 p-1 rounded-xl">
                            <TabsTrigger value="editor"
                                         className="rounded-lg font-heading font-semibold text-sm px-6 data-[state=active]:bg-white data-[state=active]:text-[#261A36] cursor-pointer">Editor</TabsTrigger>
                            <TabsTrigger value="preview"
                                         className="rounded-lg font-heading font-semibold text-sm px-6 data-[state=active]:bg-white data-[state=active]:text-[#261A36] cursor-pointer">Preview</TabsTrigger>
                        </TabsList>
                        <Button onClick={form.handleSubmit(exportJSON)} disabled={isSaving}
                                className="bg-[#7B55A3] hover:bg-[#7B55A3]/90 text-white rounded-xl h-10 px-6 font-bold font-heading shadow-lg shadow-violet-100 gap-2 cursor-pointer">
                            {isSaving ? <Loader2 className="size-4 animate-spin"/> : <Download size={18}/>} Export JSON
                        </Button>
                    </div>
                </header>

                <TabsContent value="editor" className="flex-1 flex overflow-hidden m-0 outline-none">
                    <aside
                        className="w-64 shrink-0 border-r-2 border-[#5C5C5C] bg-slate-100/50 p-5 flex flex-col gap-3 overflow-y-auto">
                        <p className="text-[10px] font-black font-heading text-slate-600 uppercase tracking-widest px-1">Add
                            Element</p>
                        {CONTROLS.map(ctrl => (
                            <button
                                key={ctrl.type}
                                onClick={() => handleAddQuestion(ctrl.type)}
                                className="flex items-center gap-3 bg-white border-2 border-slate-200 rounded-xl p-3 text-left hover:border-[#7B55A3] transition-all hover:shadow-sm group active:scale-95 cursor-pointer"
                            >
                                <span
                                    className={`size-8 rounded-lg flex items-center justify-center border ${ctrl.color}`}>{ctrl.icon}</span>
                                <div>
                                    <p className="text-xs font-bold font-heading text-slate-700 group-hover:text-[#7B55A3]">{ctrl.label}</p>
                                    <p className="text-[10px] font-heading text-slate-[#B7B7B7]400">{ctrl.desc}</p>
                                </div>
                            </button>
                        ))}
                    </aside>

                    <main className="flex-1 overflow-y-auto p-8 bg-[#FAFAFB]">
                        <div className="max-w-3xl mx-auto space-y-4 pb-20">
                            <AnimatePresence mode="popLayout">
                                {fields.map((field: any, index) => (
                                    <motion.div
                                        key={field.id}
                                        layout
                                        initial={{opacity: 0, y: 15}}
                                        animate={{opacity: 1, y: 0}}
                                        className="bg-white border-3 border-[#7B55A3] rounded-[20px] p-6 shadow-sm group relative"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline"
                                                       className={cn("border-2 rounded-full px-3 py-1 text-[10px] font-bold font-heading", TYPE_COLOR[field.type as QuestionType])}>
                                                    {field.type.toUpperCase()}
                                                </Badge>
                                                {field.isMandatory && (
                                                    <Badge
                                                        className="bg-slate-900 text-white border-none rounded-full flex gap-1 items-center text-[10px] font-heading">
                                                        <Lock size={10}/> REQUIRED
                                                    </Badge>
                                                )}
                                            </div>
                                            {!field.isMandatory && (
                                                <button onClick={() => handleRemove(index)}
                                                        className="text-slate-400 hover:text-[#C44E52] transition-colors cursor-pointer">
                                                    <Trash2 size={18}/>
                                                </button>
                                            )}
                                        </div>

                                        <Input
                                            {...form.register(`questions.${index}.questionText` as const)}
                                            placeholder="Enter question text..."
                                            readOnly={field.isMandatory}
                                            className={cn(
                                                "text-lg font-bold font-heading border-0 border-b border-slate-100 rounded-none px-0 focus-visible:ring-0 mb-4 bg-transparent shadow-none",
                                                field.isMandatory && "opacity-60 cursor-default"
                                            )}
                                        />

                                        {(field.type === 'radio' || field.type === 'checkbox') &&
                                            <OptionsEditor nest={`questions.${index}`} control={form.control}
                                                           register={form.register} type={field.type}/>}

                                        {field.type === 'slider' && (
                                            <div
                                                className="py-4 text-center bg-slate-50 border-2 border-dashed border-slate-100 rounded-xl">
                                                <p className="text-xs font-bold font-heading text-slate-400 uppercase tracking-widest">Fixed
                                                    Rating Scale: 1 — 5</p>
                                            </div>
                                        )}

                                        {field.type === 'text_input' && !field.isMandatory && (
                                            <div className="ml-4">
                                                <Label
                                                    className="text-[10px] font-bold font-heading text-slate-400 uppercase">Input
                                                    Placeholder</Label>
                                                <Input {...form.register(`questions.${index}.placeholder` as any)}
                                                       className="h-8 text-sm mt-1 font-heading"/>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </main>
                </TabsContent>

                <TabsContent value="preview" className="flex-1 bg-slate-50 overflow-y-auto p-10 outline-none">
                    <div className="max-w-2xl mx-auto space-y-8">
                        <div className="border-b border-slate-200 pb-6">
                            <h1 className="text-4xl font-bold font-heading text-[#261A36] tracking-tight">{watchedTitle}</h1>
                        </div>

                        <AnimatePresence>
                            {watchedQuestions.map((q: any, i) => (
                                <motion.div
                                    key={q.id}
                                    initial={{opacity: 0, y: 10}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{delay: i * 0.05}}
                                    className="bg-white border-3 border-[#7B55A3] rounded-[20px] p-4 shadow-sm"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span
                                            className="text-sm font-bold font-heading text-[#3C2457] tracking-widest">Question {i + 1} / {watchedQuestions.length}</span>
                                    </div>
                                    <h3 className="text-lg font-bold font-heading text-[#444444] mb-4 leading-tight">{q.questionText || "Untitled Question"}</h3>

                                    {(q.type === 'radio' || q.type === 'checkbox') && q.options?.map((o: any) => (
                                        <div key={o.id}
                                             className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl bg-slate-50/30 text-[#444444] font-bold font-heading text-base">
                                            <div
                                                className={cn("size-4 border-2 border-slate-300", q.type === 'radio' ? 'rounded-full' : 'rounded-md')}/>
                                            {o.label || "Untitled Option"}
                                        </div>
                                    ))}

                                    {q.type === 'slider' && (
                                        <div className="pt-4 space-y-6">
                                            <Slider defaultValue={[3]} max={5} min={1} step={1} disabled className="opacity-100"/>
                                            <div
                                                className="flex justify-between text-sm font-bold font-heading text-[#5D5D5D] px-2">
                                                {[1, 2, 3, 4, 5].map(val => <span key={val}>{val}</span>)}
                                            </div>
                                        </div>
                                    )}

                                    {q.type === 'text_input' && (
                                        <Input disabled placeholder={q.placeholder}
                                               className="h-14 rounded-2xl bg-slate-50 border-slate-200 cursor-default font-heading"/>
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
