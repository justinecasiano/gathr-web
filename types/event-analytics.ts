import {QuestionType} from "./feedback";

export interface ChoiceSummary {
    optionId: string;
    optionLabel: string;
    count: number;
    percentage: number;
}

export interface SliderSummary {
    ratingLabel: string;
    ratingValue: number;
    count: number;
}

export interface QuestionAnalytics {
    questionId: string;
    questionText: string;
    type: QuestionType;
    totalResponses: number;
    averageRating?: number;
    choiceData?: ChoiceSummary[];
    sliderData?: SliderSummary[];
    textAnswers?: string[];
}

export interface EventAnalytics {
    id: number;
    responseStatusSummary: {
        answered: number;
        noResponse: number;
        absent: number;
    };
    questions: QuestionAnalytics[];
}


export interface ChoiceResult {
    optionId: string;
    optionLabel: string;
    isSelected: boolean;
}

export interface SliderResult {
    ratingValue: number;
    ratingLabel: string;
}

export interface IndividualQuestionAnalytics {
    questionId: string;
    questionText: string;
    type: QuestionType;
    choiceResults?: ChoiceResult[];
    sliderResult?: SliderResult;
    textAnswer?: string;
}

export interface IndividualEventAnalytics {
    id: number;
    participantId: string;
    status: 'ANSWERED' | 'NO_RESPONSE' | 'ABSENT';
    submittedAt: string | null;
    questions: IndividualQuestionAnalytics[];
}
