import {
    Controller,
    Post,
    Get,
    Put,
    Delete,
    Param,
    Body,
    UseGuards,
    ParseIntPipe,
    HttpStatus,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { Response } from 'src/common/helpers/response.helper';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Client')
@Controller('clients')
export class ClientController {
    constructor(private readonly service: ClientService) { }

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Create client' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Client created successfully'})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Client creation failed'})
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid user id'})
    async create(@Body() dto: CreateClientDto) {
        try {
            const result = await this.service.create(dto);
            return Response.created('Client created successfully', result);
        } catch (err) {
            return Response.error({ message: 'Client creation failed', errors: err.message });
        }
    }

    @Get()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Get all client' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Get clients successfully'})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Get clients error occurred'})
    async find() {
        try {
            const result = await this.service.findAllClient();
            return Response.success({ message: 'Get clients successfully', data: result });
        } catch (err) {
            return Response.error({ message: 'Get clients error occurred', errors: err.message });
        }
    }

    @Get('client-id/:id')
    @ApiOperation({ summary: 'Get id client (only use for internal service)' })
    async getIdClient(@Param('id', ParseIntPipe) id: number) {
        try {
            const result = await this.service.findByUserId(id);
            if (!result) return Response.notFound('Client not found');
            return Response.success({ message: 'Get id client successfully', data: { id: result.id, user_id: result.user_id} });
        } catch (err) {
            return Response.error({ message: 'Get id client error occurred', errors: err.message });
        }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Get 1 client' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Get client successfully'})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Get client error occurred'})
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Client not found'})
    async findById(@Param('id', ParseIntPipe) id: number) {
        try {
            const result = await this.service.findById(id);
            if (!result) return Response.notFound('Client not found');
            return Response.success({ message: 'Get client successfully', data: result });
        } catch (err) {
            return Response.error({ message: 'Get client error occurred', errors: err.message });
        }
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Update client' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Client updated'})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Update client error occurred'})
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClientDto) {
        try {
            const result = await this.service.update(id, dto);
            return Response.success({ message: 'Client updated', data: result });
        } catch (err) {
            return Response.error({ message: 'Update client error occurred', errors: err.message });
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Delete client' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Client deleted'})
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Delete client error occurred'})
    async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            await this.service.delete(id);
            return Response.success({ message: 'Client deleted' });
        } catch (err) {
            return Response.error({ message: 'Delete client error occurred', errors: err.message });
        }
    }
}
