import { deleteZombieData } from "src/common/helpers/delete-zombie.helper";
import { fetchService } from "src/common/helpers/service-request.helper";
import { CheckResult } from "src/common/types/check-result.type";

export async function checkClientProjectRelation(): Promise<CheckResult> {
    console.log('🔍 Checking Client ↔ Project references...');
    const projects = await fetchService(`${process.env.PROJECT_SERVICE_URL}/projects`);
    let zombieProjects: number[] = [];

    for (const p of projects) {
        try {
            await fetchService(`${process.env.CLIENT_SERVICE_URL}/client/${p.client_id}`);
        } catch {
            zombieProjects.push(p.id);
        }
    }

    if (zombieProjects.length > 0) {
        await deleteZombieData(process.env.PROJECT_SERVICE_URL!, 'projects', zombieProjects);
    }

    return {
        name: 'Client ↔ Project',
        zombies: zombieProjects
    };
}