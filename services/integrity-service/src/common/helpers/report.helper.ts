import axios from 'axios';
import { getInternalAuthHeaders } from './internal-auth.helper';

export async function sendIntegrityReport(subject: string, message: string) {
  try {
    await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/send`, {
      email: process.env.ADMIN_EMAIL,
      subject,
      message
    }, {
      headers: await getInternalAuthHeaders()
    });

    console.log(`📧 Integrity report sent to ${process.env.ADMIN_EMAIL}`);
  } catch (err) {
    console.error('❌ Failed to send integrity report', err.message || err);
  }
}
