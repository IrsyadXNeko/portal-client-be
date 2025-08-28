import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InvoiceRepository } from "./invoice.repository";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";
import { getInternalAuthHeaders } from "src/common/helpers/internal-auth.helper";
import axios from "axios";

@Injectable()
export class InvoiceService {
    private repo = new InvoiceRepository();

    async create(dto: CreateInvoiceDto) {
        const isValid = await this.validateClientId(dto.client_id);
        if (!isValid) {
            throw new HttpException('Client ID is invalid', HttpStatus.BAD_REQUEST);
        }
        return await this.repo.create(dto);
    }

    async findAllInvoice() {
        return await this.repo.findAllInvoice();
    }

    async findById(id: number) {
        const invoice = await this.repo.findById(id);
        if (!invoice) throw new NotFoundException('Invoice not found');
        return invoice;
    }

    async findByClient(client_id: number) {
        return await this.repo.findByClient(client_id);
    }

    async update(id: number, dto: UpdateInvoiceDto) {
        const updated = await this.repo.update(id, dto);
        if (!updated) throw new NotFoundException('Invoice not found or nothing changed');
        return updated;
    }

    async delete(id: number) {
        return await this.repo.delete(id);
    }


    private async validateClientId(client_id: number): Promise<boolean> {
        try {
            const res = await axios.get(
                `${process.env.CLIENT_SERVICE_URL}/clients/${client_id}`,
                {
                    headers: await getInternalAuthHeaders(),
                },
            );
            return res.status === 200;
        } catch {
            return false;
        }
    }
}