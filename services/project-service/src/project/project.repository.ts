import { db } from "src/database";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

export class ProjectRepository {
    async create(dto: CreateProjectDto) {
        const res = await db.query(
            'INSERT INTO bwpc_projects (client_id, name, description, start_date, end_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [dto.client_id, dto.name, dto.description, dto.start_date, dto.end_date],
        );
        return res.rows[0];
    }

    async findProjects() {
        const res = await db.query(
            'SELECT * FROM bwpc_projects',
        );
        return res.rows;
    }

    async findById(id: number) {
        const res = await db.query(
            'SELECT * FROM bwpc_projects WHERE id = $1',
            [id],
        );
        return res.rows[0];
    }

    async findByClientId(clientId: number) {
        const res = await db.query(
            'SELECT * FROM bwpc_projects WHERE client_id = $1',
            [clientId],
        );
        return res.rows;
    }

    async update(id: number, dto: Partial<UpdateProjectDto>) {
        const field: string[] = [];
        const values: (string | number)[] = [];
        let paramIndex = 1;

        for (const key of Object.keys(dto) as (keyof UpdateProjectDto)[]) {
            const val = dto[key];
            if (val !== undefined) {
                field.push(`${key} = $${paramIndex++}`);
                values.push(val as string | number);
            }
        }

        values.push(id);
        const query = `UPDATE bwpc_projects SET ${field.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

        const res = await db.query(query, values);
        return res.rows[0];
    }

    async delete(id: number) {
        await db.query(
            'DELETE FROM bwpc_projects WHERE id = $1',
            [id],
        );
    }
}