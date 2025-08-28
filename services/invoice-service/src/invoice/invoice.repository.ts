import { db } from "src/database";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";

export class InvoiceRepository {
    async create(dto: CreateInvoiceDto) {
        const res = await db.query(
            'INSERT INTO bwpc_invoices (client_id, title, description, amount, due_date, is_recurring, recurring_interval) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [dto.client_id, dto.title, dto.description, dto.amount, dto.due_date, dto.is_recurring, dto.recurring_interval],
        );
        return res.rows[0];
    }

    async findAllInvoice() {
        const res = await db.query(
            'SELECT * FROM bwpc_invoices'
        );
        return res.rows;
    }

    async findById(id: number) {
        const res = await db.query(
            'SELECT * FROM bwpc_invoices WHERE id = $1',
            [id],
        );
        return res.rows[0];
    }

    async findByClient(clientId: number) {
        const res = await db.query(
            'SELECT * FROM bwpc_invoices WHERE client_id = $1',
            [clientId],
        )
        return res.rows;
    }

    async update(id: number, dto: UpdateInvoiceDto) {
        const fields: string[] = [];
        const values: (string | number | boolean | null)[] = [];
        let paramIndex = 1;

        for(const key of Object.keys(dto) as (keyof UpdateInvoiceDto)[]) {
            const val = dto[key];
            if (val !== undefined) {
                fields.push(`${key} = $${paramIndex++}`);
                values.push(val);
            }
        }

        if (fields.length === 0) return null;

        values.push(id);

        const res = await db.query(
            `UPDATE bwpc_invoices SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${paramIndex} RETURNING *`,
            values
        );

        return res.rows[0];
    }

    async delete(id: number) {
        await db.query('DELETE FROM bwpc_invoices WHERE id = $1', [id]);
    }
}