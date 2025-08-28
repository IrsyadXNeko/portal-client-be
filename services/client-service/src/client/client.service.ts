import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientRepository } from './client.repository';
import { getInternalAuthHeaders } from 'src/common/helpers/internal-auth.helper';

@Injectable()
export class ClientService {
    private repo = new ClientRepository();

    async create(dto: CreateClientDto) {
        const isValid = await this.validateUserId(dto.user_id);
        if (!isValid) throw new HttpException('Invalid user_id', HttpStatus.BAD_REQUEST);

        const result = await this.repo.create(dto);
        return result;
    }

    async findAllClient() {
        return await this.repo.findAllClient();
    }

    async findById(id: number) {
        return await this.repo.findById(id);
    }

    async findByUserId(userId: number) {
        return await this.repo.findByUserId(userId);
    }

    async update(id: number, dto: UpdateClientDto) {
        return await this.repo.update(id, dto);
    }

    async delete(id: number) {
        await this.repo.delete(id);
    }

    private async validateUserId(userId: number): Promise<boolean> {
        try {
            console.log("Masuk ke try validateUserId")
            console.log("userId: ", userId);
            const res = await axios.get(`${process.env.AUTH_SERVICE_URL}/auth/user/${userId}`,
                {
                    headers: await getInternalAuthHeaders(),
                },
            );
            console.log('===> check user: ', res);
            return (res.data as { code: number }).code === 200;
        } catch {
            console.log("Masuk ke catch validateUserId")
            return false;
        }
    }
}
