import jwt from 'jsonwebtoken';
import { config } from '../config';

export interface JwtPayload {
  sub: string;      // user id
  role: string;     // admin / client
  iat?: number;
  exp?: number;
}

// export function signToken(payload: JwtPayload, expiresIn: string = '1h'): string {
//   return jwt.sign(payload, config.jwtSecret, { expiresIn });
// }

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
}
