import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Req,
    UseGuards,
} from '@nestjs/common';
import { BiodataRequestService } from './biodata-request.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ClientGuard } from '../common/guards/client.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Response } from 'src/common/helpers/response.helper';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Biodata Client Request')
@Controller('biodata-requests')
export class BiodataRequestController {
    constructor(private readonly service: BiodataRequestService) { }

    @Post()
    @UseGuards(JwtAuthGuard, ClientGuard)
    @ApiOperation({ summary: 'Create request biodata' })
    @ApiResponse({ example: HttpStatus.CREATED, description: 'Request submitted' })
    @ApiResponse({ example: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Request failed' })
    async create(@Body() dto: CreateRequestDto) {
        try {
            const result = await this.service.create(dto);
            return Response.created('Request submitted', result);
        } catch (err) {
            return Response.error({ message: 'Request failed', errors: err.message });
        }
    }

    @Get('client')
    @UseGuards(JwtAuthGuard, ClientGuard)
    @ApiOperation({ summary: 'Get 1 client data' })
    @ApiResponse({ example: HttpStatus.OK, description: 'Get request successfully' })
    @ApiResponse({ example: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Get request failed' })
    async getMyRequests(@Req() req) {
        try {
            const client_id = req.user.client_id; // assume JWT payload contains client ID
            console.log('==> client_id: ', client_id);
            const result = await this.service.getByClientId(client_id);
            return Response.success({ message: 'Get request successfully', data: result });
        } catch (err) {
            return Response.error({ message: 'Get request failed', errors: err.message });
        }
    }

    @Get()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Get all request biodata' })
    @ApiResponse({ example: HttpStatus.OK, description: 'Get request successfully' })
    @ApiResponse({ example: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Get request failed' })
    @ApiResponse({ example: HttpStatus.NOT_FOUND, description: 'Request not found' })
    async getBiodataRequest() {
        try {
            const result = await this.service.getAllRequest();
            return result
                ? Response.success({ message: 'Get request successfully', data: result })
                : Response.notFound('Request not found');
        } catch (err) {
            return Response.error({ message: 'Get request failed', errors: err.message });
        }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Get 1 request biodata' })
    @ApiResponse({ example: HttpStatus.OK, description: 'Get request successfully' })
    @ApiResponse({ example: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Get request failed' })
    @ApiResponse({ example: HttpStatus.NOT_FOUND, description: 'Request not found' })
    async getById(@Param('id', ParseIntPipe) id: number) {
        try {
            const result = await this.service.getById(id);
            return result
                ? Response.success({ message: 'Get request successfully', data: result })
                : Response.notFound('Not found');
        } catch (err) {
            return Response.error({ message: 'Get request failed', errors: err.message });
        }
    }

    @Put(':id/status')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Update status request biodata approved or reject' })
    @ApiResponse({ example: HttpStatus.OK, description: 'Update status request successfully' })
    @ApiResponse({ example: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Update status request failed' })
    async updateStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStatusDto) {
        try {
            const result = await this.service.updateStatus(id, dto);
            return Response.success({ message: 'Update status request successfully', data: result });
        } catch (err) {
            return Response.error({ message: 'Update status request failed', errors: err.message });
        }
    }
}
