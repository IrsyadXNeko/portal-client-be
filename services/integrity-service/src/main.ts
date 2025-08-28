import * as dotenv from 'dotenv';
import cron from 'node-cron';
import { checkClientProjectRelation } from './checks/client-project.check';
import { checkClientInvoiceRelation } from './checks/client-invoice.check';
import { checkClientTicketRelation } from './checks/client-ticket.check';
import { checkUserClientRelation } from './checks/user-client.check';
import { sendIntegrityReport } from './common/helpers/report.helper';
import { CheckResult } from './common/types/check-result.type';

dotenv.config();

async function safeCheck(fn: () => Promise<CheckResult>, name: string): Promise<CheckResult> {
  try {
    return await fn();
  } catch (err: any) {
    console.error(`❌ Check failed for ${name}:`, err.message || err);
    return {
      name,
      zombies: [-1] // tanda khusus kalau gagal
    };
  }
}

async function runChecksAndReport() {
  const results: CheckResult[] = await Promise.all([
    safeCheck(checkClientProjectRelation, 'Client ↔ Project'),
    safeCheck(checkClientInvoiceRelation, 'Client ↔ Invoice'),
    safeCheck(checkClientTicketRelation, 'Client ↔ Ticket'),
    safeCheck(checkUserClientRelation, 'User ↔ Client')
  ]);

  let reportContent = '<h2>Daily Data Integrity Report</h2><ul>';
  let hasZombie = false;

  for (const r of results) {
    if (r.zombies.length === 1 && r.zombies[0] === -1) {
      reportContent += `<li><b>${r.name}:</b> ❌ Check failed - see server logs</li>`;
    } else if (r.zombies.length > 0) {
      hasZombie = true;
      reportContent += `<li><b>${r.name}:</b> ${r.zombies.length} zombie(s) → IDs: ${r.zombies.join(', ')}</li>`;
    } else {
      reportContent += `<li><b>${r.name}:</b> ✅ No zombies found</li>`;
    }
  }

  reportContent += '</ul>';

  if (hasZombie) {
    await sendIntegrityReport('Daily Data Integrity Report - Issues Found', reportContent);
  } else {
    await sendIntegrityReport('Daily Data Integrity Report - All Clear', reportContent);
  }
}

// Cron tiap jam 3 pagi
cron.schedule('0 3 * * *', async () => {
  console.log('🚀 Running daily data integrity checks...');
  await runChecksAndReport();
});

// Untuk test manual
(async () => {
  await runChecksAndReport();
})();