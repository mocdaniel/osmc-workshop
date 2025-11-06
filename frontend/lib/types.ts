export type Speaker = {
    id: number;
    name: string;
    bio: string;
    company: string;
    talks: number[]
}

export type Talk = {
    id: number;
    title: string;
    abstract: string;
    speaker_id: number;
    is_bookmarked: boolean;
    start_time: Date;
    end_time: Date;
}

export type TalkWithSpeaker = Talk & {
    speaker: Speaker | null;
}
