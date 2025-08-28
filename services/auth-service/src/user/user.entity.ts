export class User {
    id: number;
    role: 'admin' | 'client';
    username: string;
    email: string;
    password: string;
    forcePasswordChange: boolean;
    createdAt: Date;
}