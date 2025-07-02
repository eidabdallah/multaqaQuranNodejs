import PasswordResetCodeCleaner from './cleanupExpiredCodes';
import UnconfirmedAccountCleaner from './UnconfirmedAccountCleaner';
export default function registerCronJobs() {
    PasswordResetCodeCleaner.start();
    UnconfirmedAccountCleaner.start();
}