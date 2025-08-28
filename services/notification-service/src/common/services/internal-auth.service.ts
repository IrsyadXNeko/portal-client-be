import axios from 'axios';
import {
    INTERNAL_AUTH_USERNAME,
    INTERNAL_AUTH_PASSWORD,
    AUTH_SERVICE_LOGIN_URL,
} from '../constants/internal-token.constant';
import { AuthLoginResponse } from '../types/auth-response.type';

let accessToken: string | null = null;
let refreshToken: string | null = null;

export async function getValidAccessToken(): Promise<string> {
    console.log('start getValidAccessToken')
    if (!accessToken || !(await isTokenStillValid(accessToken))) {
        await loginAndStoreToken();
    }

    return accessToken!;
}

async function loginAndStoreToken(): Promise<void> {
    console.log('start loginAndStoreToken')
    const res = await axios.post<AuthLoginResponse>(AUTH_SERVICE_LOGIN_URL, {
        username: INTERNAL_AUTH_USERNAME,
        password: INTERNAL_AUTH_PASSWORD,
    });

    console.log('==> access token internal: ', res.data.data.accessToken);
    console.log('==> refresh token internal: ', res.data.data.refreshToken);

    accessToken = res.data.data.accessToken;
    refreshToken = res.data.data.refreshToken;
}

async function isTokenStillValid(token: string): Promise<boolean> {
    console.log('start isTokenStillValid')
    try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        const exp = payload.exp * 1000;
        return Date.now() < exp - 10_000; // minimal 10 detik sebelum expired
    } catch {
        return false;
    }
}
