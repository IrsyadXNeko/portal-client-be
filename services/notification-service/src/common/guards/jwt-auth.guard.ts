import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) return false;

        const token = authHeader.split(' ')[1];
        try {
            console.log('🛡️ Token:', token);
            const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECRET });
            console.log('🛡️ JWT Payload:', payload);
            req.user = {
                id: payload.sub,
                client_id: payload.client_id,
                role: payload.role,
                username: payload.username,
                email: payload.email,
                force_password_change: payload.force_password_change,
            };
            return true;
        } catch (err) {
            console.error('❌ JWT Error:', err.message);
            return false;
        }
    }
}