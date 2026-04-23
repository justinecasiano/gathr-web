export type QuestionType = 'radio' | 'checkbox' | 'slider' | 'text_input';

interface BaseQuestion {
    id: string;
    type: QuestionType;
    questionText: string;
    required: boolean;
    order: number;
}

export interface ChoiceQuestion extends BaseQuestion {
    type: 'radio' | 'checkbox';
    options: { id: string; label: string }[];
}

export interface SliderQuestion extends BaseQuestion {
    type: 'slider';
    minLabel?: string;
    maxLabel?: string;
    maxRating: 5;
}

export interface TextQuestion extends BaseQuestion {
    type: 'text_input';
    placeholder?: string;
}

export type FeedbackQuestion = ChoiceQuestion | SliderQuestion | TextQuestion;

export interface QuestionResponse {
    questionId: string;
    answer: string | string[] | number;
}

export interface FormSubmission {
    id?: string;
    eventId: string;
    participantId?: string;
    responses: QuestionResponse[];
    submittedAt: string;
}

