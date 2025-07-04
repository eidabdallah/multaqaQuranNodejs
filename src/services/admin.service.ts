import User from '../models/user.model';

export default class AdminService {
    async getAllRequests(): Promise<User[] | null> {
        return await User.findAll({
            where: { status: 'No_Active', confirmEmail: true, role: 'Student' },
            attributes: ['id', 'universityId', 'fullName', 'status', 'phoneNumber', 'CollegeName', 'role']
        });
    }
    async checkUser(id: number): Promise<User | null> {
        return await User.findByPk(id);
    }
    async acceptRequest(id: number): Promise<number> {
        const [affectedRows] = await User.update( { status: 'Active' },{ where: { id }});
        return affectedRows;
    }
}