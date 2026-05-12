import { FormEditorValues } from "@/types/feedback";
import { User } from "@/types/user";

export interface BaseEvent {
    id: number;
    title: string;
    description: string;
    allowed_departments: string[] | null;
    allow_non_umak: boolean;
    allow_alumni: boolean;
    background_image: string | null;
    location: string;
    start_time: string;
    end_time: string;
    capacity: number;
    feedback_form: FormEditorValues | null;
    created_by: string;
    creator?: User;
    status: "APPROVED" | "PENDING" | "REJECTED";
    submitted_at: string;
    updated_at: string | null;
    approved_by: string | null;
    comment: string | null;
    approved_at: string | null;
    is_archive: boolean;
    is_form_active: boolean;
    form_title: string | null;
    deleted_at: string | null;

    participants?: { count: number }[];
    response_count?: { count: number }[];
    present_count?: { count: number }[];
    event_status: "UPCOMING" | "ONGOING" | "ENDED";
    has_feedback_form: boolean;
    question_count: number;
    avg_rating: number;
}

export interface SimpleEvent {
    id: number;
    title: string;
    location: string;
    date: string;
    organizer: string;
    attendees: string;
    status: string;
    hasFeedback: boolean;
    image: string;
}

export interface FeedbackEvent {
    id: number;
    title: string;
    location: string;
    image: string;
    status: string;
    isFormActive: boolean;
    hasFeedback: boolean;
    questionCount: number;
    responseCount: number;
    feedbackForm: FormEditorValues | null;
}

export interface IndividualResponse {
    id: string;
    fullName: string;
    eventId: number;
    eventLocation: string;
    hasFeedback: boolean;
}
