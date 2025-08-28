import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrpyt from "bcrypt";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService {
    private repo = new UserRepository();

    async createUser(dto: CreateUserDto) {
        try {
            const hashed = await bcrpyt.hash(dto.password, 10);
            return await this.repo.createUser({ ...dto, password: hashed });
        } catch (err) {
            throw new Error('Failed create user');
        }
    }

    async findAllUser() {
        return await this.repo.findAllUser();
    }

    async findByUsername(username: string) {
        return await this.repo.findByUsername(username);
    }

    async findByEmail(email: string) {
        return await this.repo.findByEmail(email);
    }

    async findById(id: number) {
        return await this.repo.findById(id);
    }

    async updatePassword(id: number, newPassword: string) {
        const hashed = await bcrpyt.hash(newPassword, 10);
        return await this.repo.updatePassword(id, hashed);
    }
}