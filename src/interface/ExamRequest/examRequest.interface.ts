export interface ExamRequestAttributes {
    id: number;
    StudentId: number;
    SupervisorId: number;
    examType: 'تجريبي' | 'رسمي';
    timeExam: string;
    date: string;
    parts: string;
    examPattern: 'تثبيت' | 'عادي';
    status: "انتظار" | "تاكيد" | "رفض";
    createdAt?: Date;
    updatedAt?: Date;
}