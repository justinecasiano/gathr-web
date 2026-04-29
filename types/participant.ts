import {User} from "@/types/user";
import {FormSubmission} from "@/types/feedback";

export type ParticipantType = 'ATTENDEE' | 'ORGANIZER' | 'STAFF';
export type ParticipantStatus = 'REGISTERED' | 'CHECKED_IN' | 'CANCELLED' | 'PRESENT' | 'ABSENT';
export type ResponseStatus = 'ANSWERED' | 'NO_RESPONSE' | 'ABSENT';

export interface Participant {
    event_id: number;
    user_id: string;
    participant_type: ParticipantType;
    participant_role: string | null;
    status: ParticipantStatus;
    check_in: string | null;
    feedback_submission: FormSubmission | null;
    feedback_submitted_at: string | null;
    joined_at: string;
    response_status: ResponseStatus;
    rating: number | null;
    comment: string | null;
}
