import { sendNotification } from 'src/common/helpers/notification.helper';
import { db } from '../database';

export async function sendDueDateReminders() {
  try {
    const today = new Date();
    const oneDayAhead = new Date(today);
    oneDayAhead.setDate(today.getDate() + 1);

    const todayStr = today.toISOString().split('T')[0];
    const aheadStr = oneDayAhead.toISOString().split('T')[0];

    const res = await db.query(
      `SELECT * FROM bwpc_invoices WHERE status = 'unpaid' AND (due_date = $1 OR due_date = $2)`,
      [todayStr, aheadStr],
    );

    for (const invoice of res.rows) {
      let subject = '';
      let message = '';

      if (invoice.due_date === aheadStr) {
        subject = 'Invoice Due Tomorrow';
        message = `<p>Dear Client,</p><p>Your invoice "<b>${invoice.title}</b>" is due tomorrow (${invoice.due_date}). Please make the payment on time.</p>`;
      } else if (invoice.due_date === todayStr) {
        subject = 'Invoice Due Today';
        message = `<p>Dear Client,</p><p>Your invoice "<b>${invoice.title}</b>" is due today. Please make the payment immediately.</p>`;
      }

      await sendNotification(invoice.client_id, subject, message);
    }

    console.log(`📧 Sent ${res.rowCount} payment reminders`);
  } catch (err) {
    console.error('❌ Failed to send reminders', err);
  }
}
