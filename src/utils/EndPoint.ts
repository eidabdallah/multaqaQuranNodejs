import { Roles } from "./enum/role.enum";

export const endPoints = {
    all: [Roles.ADMIN, Roles.STUDENT , Roles.DOCTOR, Roles.SUPERVISOR, Roles.COLLEGE_SUPERVISOR],
    adminOnly: [Roles.ADMIN],
    doctorOnly: [Roles.DOCTOR],
    studentOnly: [Roles.STUDENT],
    collegeSupervisorOnly: [Roles.COLLEGE_SUPERVISOR],
    supervisorOnly: [Roles.SUPERVISOR, Roles.COLLEGE_SUPERVISOR],
};