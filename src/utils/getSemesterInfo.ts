export function getSemesterInfo(date: Date) {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    let semester = '';
    let semesterYear = '';
    if (month >= 9) {
        semester = 'الفصل الأول';
        semesterYear = `${year}/${year + 1}`;
    } else if (month === 1) {
        semester = 'الفصل الأول';
        semesterYear = `${year - 1}/${year}`;
    } else if (month >= 2 && month <= 6) {
        semester = 'الفصل الثاني';
        semesterYear = `${year - 1}/${year}`;
    } else if (month === 7 || month === 8) {
        semester = 'الفصل الصيفي';
        semesterYear = `${year - 1}/${year}`;
    }

    return { semester, semesterYear };
}

export function semesterOrder(semester: string) {
    if (semester === 'الفصل الصيفي') return 3;
    if (semester === 'الفصل الثاني') return 2;
    if (semester === 'الفصل الأول') return 1;
    return 0;
}