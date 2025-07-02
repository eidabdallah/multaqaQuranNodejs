import cron from 'node-cron';
import User from './../models/user.model';

export default class UnconfirmedAccountCleaner {
    static start() {
        cron.schedule('0 0 */21 * *', async () => {
            try {
                await User.destroy({
                    where: { confirmEmail: false }
                });
            } catch (error) {
                console.error('Error during cleanup:', error);
            }
        });
    }
}
