export interface IStudentDailyFollowUp {
    id: number;
    ReviewInfo: string;
    savedInfo: string;
    userId: number;
    note: string;
    pageNumberSaved: number;
    pageNumberReview: number
    date: Date;
}