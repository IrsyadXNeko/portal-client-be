import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
    UseGuards,
    HttpStatus,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { ClientGuard } from '../common/guards/client.guard';
import { sendNotification } from 'src/common/helpers/notification.helper';
import { Response } from 'src/common/helpers/response.helper';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Invoice')
@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService) { }

    @Post()
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Create invoice & send to client email' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Invoice created successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to create invoce' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Client ID is invalid' })
    async create(@Body() dto: CreateInvoiceDto) {
        try {
            const invoice = await this.invoiceService.create(dto);

            await sendNotification(
                dto.client_id,
                'New Invoice Created',
                `<p>Dear Client,</p><p>Your invoice <b>${dto.title}</b> has been created with amount: ${dto.amount}.</p><p>Due date: ${dto.due_date}</p>`
            );

            return Response.created('Invoice created successfully', invoice);
        } catch (err) {
            return Response.error({ message: 'Failed to create invoce', errors: err.message });
        }
    }

    @Get()
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Get all invoice' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Get invoices successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to get invoce' })
    async findAllInvoice() {
        try {
            const invoice = await this.invoiceService.findAllInvoice();
            return Response.success({ message: 'Get invoices successfully', data: invoice });
        } catch (err) {
            return Response.error({ message: 'Failed to get invoce', errors: err.message });
        }
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get 1 invoice' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Get invoice successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to get invoce' })
    async findById(@Param('id') id: number) {
        try {
            const invoice = await this.invoiceService.findById(id);
            return Response.success({ message: 'Get invoice successfully', data: invoice });
        } catch (err) {
            return Response.error({ message: 'Failed to get invoce', errors: err.message });
        }
    }

    @Get('/client/:id')
    @UseGuards(ClientGuard)
    @ApiOperation({ summary: 'Get invoice for client' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Get invoice successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to get invoce' })
    async findByClient(@Param('id') id: number) {
        try {
            const data = await this.invoiceService.findByClient(id);
            return Response.success({ message: 'Get invoice successfully', data: data });
        } catch (err) {
            return Response.error({ message: 'Failed to get invoce', errors: err.message });
        }
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Update invoice' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Invoice updated' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to update invoce' })
    async update(@Param('id') id: number, @Body() dto: UpdateInvoiceDto) {
        try {
            const updated = await this.invoiceService.update(id, dto);
            return Response.success({ message: 'Invoice updated', data: updated });
        } catch (err) {
            return Response.error({ message: 'Failed to update invoce', errors: err.message });
        }
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    @ApiOperation({ summary: 'Delete invoice' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Invoice deleted' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to delete invoce' })
    async delete(@Param('id') id: number) {
        try {
            await this.invoiceService.delete(id);
            return Response.success({ message: 'Invoice deleted' });
        } catch (err) {
            return Response.error({ message: 'Failed to delete invoce', errors: err.message });
        }
    }
}
