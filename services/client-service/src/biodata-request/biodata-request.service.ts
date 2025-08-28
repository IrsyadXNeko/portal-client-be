import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { BiodataRequestRepository } from './biodata-request.repository';

@Injectable()
export class BiodataRequestService {
    private repo = new BiodataRequestRepository();

    async create(dto: CreateRequestDto) {
        return await this.repo.create(dto);
    }

    async getAllRequest() {
        return await this.repo.findAllRequest();
    }

    async getById(id: number) {
        return await this.repo.findById(id);
    }

    async getByClientId(client_id: number) {
        return await this.repo.findByClientId(client_id);
    }

    async updateStatus(id: number, dto: UpdateStatusDto) {
        const updated = await this.repo.updateStatus(id, dto.status);

        if (dto.status === 'approved') {
            await this.repo.updateAprroved(id);
        }

        return updated;
    }
}
