import { getValidAccessToken } from '../services/internal-auth.service';
import { INTERNAL_AUTH_HEADER, INTERNAL_TOKEN_PREFIX } from '../constants/internal-token.constant';

export async function getInternalAuthHeaders(): Promise<Record<string, string>> {
    console.log('start getInternalAuthHeaders')
    const token = await getValidAccessToken();

    return {
        [INTERNAL_AUTH_HEADER]: `${INTERNAL_TOKEN_PREFIX} ${token}`,
    };
}