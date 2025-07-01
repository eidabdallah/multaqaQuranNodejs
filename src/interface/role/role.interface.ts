export interface RoleAttributes {
    id: number;
    name: 'Admin' | 'Supervisor' | 'Doctor' | 'Student' | 'CollegeSupervisor';
    userId: number;
}