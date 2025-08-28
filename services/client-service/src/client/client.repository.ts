import { db } from '../database';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

export class ClientRepository {
    async create(dto: CreateClientDto) {
        const result = await db.query(
            `INSERT INTO bwpc_clients (user_id, company_name, contact_person, phone, address)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [dto.user_id, dto.company_name, dto.contact_person, dto.phone, dto.address],
        );
        return result.rows[0];
    }

    async findAllClient() {
        const result = await db.query('SELECT * FROM bwpc_clients');
        return result.rows;
    }

    async findById(id: number) {
        const result = await db.query(`SELECT * FROM bwpc_clients WHERE id = $1`, [id]);
        return result.rows[0];
    }

    async findByUserId(userId: number) {
        const result = await db.query(`SELECT * FROM bwpc_clients WHERE user_id = $1`, [userId]);
        return result.rows[0];
    }

    async update(id: number, dto: Partial<UpdateClientDto>) {
        const fields: string[] = [];
        const values: (string | number)[] = [];
        let paramIndex = 1;

        for (const key of Object.keys(dto) as (keyof UpdateClientDto)[]) {
            const val = dto[key];
            if (val !== undefined) {
                fields.push(`${key} = $${paramIndex++}`);
                values.push(val as string | number); // safe cast
            }
        }

        values.push(id);
        const query = `UPDATE bwpc_clients SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

        const result = await db.query(query, values);
        return result.rows[0];
    }

    async delete(id: number) {
        await db.query(`DELETE FROM bwpc_clients WHERE id = $1`, [id]);
    }
}
