import { db } from "../database";
import { CreateUserDto } from "./dto/create-user.dto";

export class UserRepository {
    async createUser(dto: CreateUserDto) {
        const result = await db.query('INSERT INTO pc_users (role, username, email, password) VALUES ($1, $2, $3, $4) RETURNING id', [dto.role, dto.username, dto.email, dto.password]);
        return result.rows[0];
    }

    async findAllUser() {
        const result = await db.query('SELECT * FROM pc_users');
        return result.rows;
    }

    async findByUsername(username: string) {
        const result = await db.query('SELECT * FROM pc_users WHERE username = $1', [username]);
        return result.rows[0];
    }

    async findByEmail(email: string) {
        const result = await db.query('SELECT * FROM pc_users WHERE email = $1', [email]);
        return result.rows[0];
    }

    async findById(id: number) {
        const result = await db.query('SELECT * FROM pc_users WHERE id = $1', [id]);
        return result.rows[0];
    }

    async updatePassword(id: number, newPassword: string) {
        await db.query('UPDATE pc_users SET password = $1, force_password_change = false WHERE id = $2', [newPassword, id]);
    }
}