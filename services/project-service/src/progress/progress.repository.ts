import { db } from "src/database";
import { CreateProgressDto } from "./dto/create-progress.dto";
import { UpdateProgressDto } from "./dto/update-progress.dto";

export class ProgressRepository {
    async create(dto: CreateProgressDto) {
        const res = await db.query(
            'INSERT INTO bwpc_project_progress (project_id, description) VALUES ($1, $2) RETURNING *',
            [dto.project_id, dto.description],
        );
        return res.rows[0];
    }

    async findByProject(project_id: number) {
        const res = await db.query(
            'SELECT * FROM bwpc_project_progress WHERE project_id = $1',
            [project_id],
        );
        return res.rows;
    }

    async update(id: number, dto: UpdateProgressDto) {
        const res = await db.query(
            'UPDATE bwpc_project_progress SET description = $1 WHERE id = $2 RETURNING *',
            [dto.description, id],
        );
        return res.rows[0];
    }

    async delete(id: number) {
        await db.query(
            'DELETE FROM bwpc_project_progress WHERE id = $1',
            [id],
        );
    }
}