import axios from 'axios';
import { getInternalAuthHeaders } from './internal-auth.helper';

export async function sendNotification(toClientId: number, subject: string, message: string) {
  await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/send`, {
    toClientId,
    subject,
    message
  }, {
    headers: await getInternalAuthHeaders()
  });
}