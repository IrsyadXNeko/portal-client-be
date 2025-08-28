import { CheckResult } from 'src/common/types/check-result.type';
import { fetchService } from '../common/helpers/service-request.helper';
import { deleteZombieData } from 'src/common/helpers/delete-zombie.helper';

export async function checkClientInvoiceRelation(): Promise<CheckResult> {
  console.log('🔍 Checking Client ↔ Invoice references...');
  const invoices = await fetchService(`${process.env.INVOICE_SERVICE_URL}/invoices`);
  let zombieInvoices: number[] = [];

  for (const inv of invoices) {
    try {
      await fetchService(`${process.env.CLIENT_SERVICE_URL}/client/${inv.client_id}`);
    } catch {
      zombieInvoices.push(inv.id);
    }
  }

  if (zombieInvoices.length > 0) {
    await deleteZombieData(process.env.INVOICE_SERVICE_URL!, 'invoices', zombieInvoices);
  }
  
  return {
    name: 'Client ↔ Invoice',
    zombies: zombieInvoices
  };

}
