import { db } from '../database';
import { CreateRequestDto } from './dto/create-request.dto';

export class BiodataRequestRepository {
    async create(dto: CreateRequestDto) {
        const res = await db.query(
            `INSERT INTO pc_biodata_update_requests
      (client_id, new_company_name, new_contact_person, new_phone, new_address)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [dto.client_id, dto.new_company_name, dto.new_contact_person, dto.new_phone, dto.new_address],
        );
        return res.rows[0];
    }

    async findAllRequest() {
        const res = await db.query(`SELECT * FROM pc_biodata_update_requests`);
        return res.rows;
    }

    async findById(id: number) {
        const res = await db.query(`SELECT * FROM pc_biodata_update_requests WHERE id = $1`, [id]);
        return res.rows[0];
    }

    async findByClientId(client_id: number) {
        const res = await db.query(`SELECT * FROM pc_biodata_update_requests WHERE client_id = $1`, [client_id]);
        return res.rows;
    }

    async updateStatus(id: number, status: string) {
        const res = await db.query(
            `UPDATE pc_biodata_update_requests SET status = $1 WHERE id = $2 RETURNING *`,
            [status, id],
        );
        return res.rows[0];
    }

    async updateAprroved(id: number) {
        const requestData = await this.findById(id);

        // lakukan update ke tabel clients
        await db.query(
            `UPDATE pc_clients SET company_name = $1, contact_person = $2, phone = $3, address = $4 WHERE id = $5`,
            [
                requestData.new_company_name,
                requestData.new_contact_person,
                requestData.new_phone,
                requestData.new_address,
                requestData.client_id,
            ],
        );
    }
}
