import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ProgressRepository } from "./progress.repository";
import { ProjectRepository } from "src/project/project.repository";
import { CreateProgressDto } from "./dto/create-progress.dto";
import { UpdateProgressDto } from "./dto/update-progress.dto";

@Injectable()
export class ProgressService {
    private readonly progressRepo = new ProgressRepository();
    private readonly projectRepo = new ProjectRepository();

    async create(dto: CreateProgressDto) {
        const project = await this.projectRepo.findById(dto.project_id);
        if (!project) throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
        
        return await this.progressRepo.create(dto);
    }

    async findByProject(projectId: number) {
        return await this.progressRepo.findByProject(projectId);
    }

    async update(id: number, dto: UpdateProgressDto) {
        return await this.progressRepo.update(id, dto);
    }

    async delete(id: number) {
        return await this.progressRepo.delete(id);
    }

    async isProjectOwnedByClient(projectId: number, clientId: number): Promise<boolean> {
        const project = await this.projectRepo.findById(projectId);
        return project && project.client_id === clientId;
    }
}