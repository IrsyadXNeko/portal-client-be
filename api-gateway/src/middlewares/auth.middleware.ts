import { Request, Response, NextFunction } from 'express';
import { ResponseHelper } from '../utils/response.helper';
import { verifyToken } from '../utils/jwt.helper';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.header('authorization');
    if (!authHeader) {
        return res.status(401).json(ResponseHelper.unauthorized('Unauthorized: Missing token'));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json(ResponseHelper.unauthorized('Unauthorized: Invalid token format'));
    }

    try {
        const payload = verifyToken(token);
        (req as any).user = payload;
        next();
    } catch (err) {
        return res.status(401).json(ResponseHelper.unauthorized('Unauthorized: Invalid token'));
    }
}