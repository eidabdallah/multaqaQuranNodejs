export interface ExamAttributes {
    id?: number;
    StudentId: number;
    SupervisorId: number | null;
    examType: 'تجريبي' | 'رسمي';
    timeExam: string;
    date: string;
    parts: string;
    examPattern: 'تثبيت' | 'عادي';
    grade: number | null;
    statusGrade: 'راسب' | 'ناجح' | null;
}