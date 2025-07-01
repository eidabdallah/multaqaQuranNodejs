export interface UserAttributes {
    id: number;
    universityId: string;
    fullName: string;
    password: string;
    phoneNumber: string;
    CollegeName: string;
    confirmEmail: boolean;
    status: 'Active' | 'No_Active';
}
