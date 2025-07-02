import cron from 'node-cron';
import passwordResetCode from './../models/passwordResetCode.model';

export default class PasswordResetCodeCleaner {
    static start() {
        cron.schedule('0 0 */15 * *', async () => {
            try {
                await passwordResetCode.destroy({ truncate: true });
                console.log('Password reset codes cleaned successfully.');
            } catch (error) {
                console.error('Error during cleanup:', error);
            }
        });
    }
}
