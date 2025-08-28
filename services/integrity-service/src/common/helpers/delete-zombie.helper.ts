import axios from 'axios';
import { getInternalAuthHeaders } from './internal-auth.helper';

export async function deleteZombieData(serviceUrl: string, resource: string, ids: number[]) {
  if (!process.env.AUTO_DELETE_ZOMBIES || process.env.AUTO_DELETE_ZOMBIES !== 'true') {
    console.log(`⚠ Auto-delete disabled for ${resource}`);
    return;
  }

  for (const id of ids) {
    try {
      await axios.delete(`${serviceUrl}/${resource}/${id}`, {
        headers: await getInternalAuthHeaders()
      });
      console.log(`🗑 Deleted zombie ${resource} with ID: ${id}`);
    } catch (err: any) {
      console.error(`❌ Failed to delete ${resource} ID ${id}:`, err.message || err);
    }
  }
}
