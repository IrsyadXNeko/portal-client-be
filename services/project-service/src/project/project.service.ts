import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import axios from "axios";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectRepository } from "./project.repository";
import { getInternalAuthHeaders } from "src/common/helpers/internal-auth.helper";

@Injectable()
export class ProjectService {
    private readonly repo = new ProjectRepository();

    async create(dto: CreateProjectDto) {
        const isValid = await this.validateClientId(dto.client_id);
        if (!isValid) throw new HttpException('Client ID is invalid', HttpStatus.BAD_REQUEST);

        return await this.repo.create(dto);
    }

    async findProjects() {
        return await this.repo.findProjects();
    }

    async findById(id: number) {
        return await this.repo.findById(id);
    }

    async findByClientId(client_id: number) {
        return await this.repo.findByClientId(client_id);
    }

    async update(id: number, dto: UpdateProjectDto) {
        return await this.repo.update(id, dto);
    }

    async delete(id: number) {
        return await this.repo.delete(id);
    }

    private async validateClientId(client_id: number): Promise<boolean> {
        try {
            console.log('===> check client_id: ', client_id);
            const res = await axios.get(
                `${process.env.CLIENT_SERVICE_URL}/clients/${client_id}`,
                { headers: await getInternalAuthHeaders() },
            );
            console.log('===> check client: ', res);
            return res.status === 200;
        } catch {
            return false;
        }
    }
}