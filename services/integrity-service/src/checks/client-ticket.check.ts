import { CheckResult } from 'src/common/types/check-result.type';
import { fetchService } from '../common/helpers/service-request.helper';
import { deleteZombieData } from 'src/common/helpers/delete-zombie.helper';

export async function checkClientTicketRelation(): Promise<CheckResult> {
  console.log('🔍 Checking Client ↔ Ticket references...');
  const tickets = await fetchService(`${process.env.TICKET_SERVICE_URL}/tickets`);
  let zombieTickets: number[] = [];

  for (const t of tickets) {
    try {
      await fetchService(`${process.env.CLIENT_SERVICE_URL}/client/${t.client_id}`);
    } catch {
      zombieTickets.push(t.id);
    }
  }

  if (zombieTickets.length > 0) {
    await deleteZombieData(process.env.TICKET_SERVICE_URL!, 'tickets', zombieTickets);
  }

  return {
    name: 'Client ↔ Ticket',
    zombies: zombieTickets
  };

}
