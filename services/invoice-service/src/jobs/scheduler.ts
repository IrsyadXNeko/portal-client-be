import cron from 'node-cron';
import { generateRecurringInvoices } from './recurring.generator';
import { sendDueDateReminders } from './email-reminder';

export function startSchedulers() {
  // Setiap hari jam 00:00 → generate invoice
  cron.schedule('0 0 * * *', async () => {
    await generateRecurringInvoices();
  });

  // Setiap jam 9 pagi → kirim pengingat jatuh tempo
  cron.schedule('0 9 * * *', async () => {
    await sendDueDateReminders();
  });

  console.log('⏱️ Schedulers started...');
}
