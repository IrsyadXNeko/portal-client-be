import { CheckResult } from 'src/common/types/check-result.type';
import { fetchService } from '../common/helpers/service-request.helper';
import { deleteZombieData } from 'src/common/helpers/delete-zombie.helper';

export async function checkUserClientRelation(): Promise<CheckResult> {
    console.log('🔍 Checking User ↔ Client references...');
    const clients = await fetchService(`${process.env.CLIENT_SERVICE_URL}/clients`);
    let zombieClients: number[] = [];

    for (const c of clients) {
        try {
            await fetchService(`${process.env.USER_SERVICE_URL}/user/${c.client_id}`);
        } catch {
            zombieClients.push(c.id);
        }
    }

    if (zombieClients.length > 0) {
        await deleteZombieData(process.env.CLIENT_SERVICE_URL!, 'clients', zombieClients);
      }
    
      return {
        name: 'User ↔ Client',
        zombies: zombieClients
      };
}
