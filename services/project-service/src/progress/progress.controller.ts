import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { ClientGuard } from '../common/guards/client.guard';
import { Response } from 'src/common/helpers/response.helper';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Progress Project')
@Controller('progress')
export class ProgressController {
    constructor(private readonly service: ProgressService) { }

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Create project' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Progress created successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to create progress' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Project not found' })
    async create(@Body() dto: CreateProgressDto) {
        try {
            const result = await this.service.create(dto);
            return Response.created('Progress created successfully', result);
        } catch (err) {
            return Response.error({ message: 'Failed to create progress', errors: err.message });
        }
    }

    @Get('project/:projectId')
    @UseGuards(JwtAuthGuard, ClientGuard)
    @ApiOperation({ summary: 'Get project for client' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Get project successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to get project' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'You are not allowed to view this project progress' })
    async findByProject(
        @Param('projectId', ParseIntPipe) projectId: number,
        @Req() req
    ) {
        try {
            const clientId = req.user.client_id;
            const owned = await this.service.isProjectOwnedByClient(projectId, clientId);

            if (!owned) {
                return Response.forbidden('You are not allowed to view this project progress');
            }

            const result = await this.service.findByProject(projectId);
            return Response.success({ message: 'Get project successfully', data: result });
        } catch (err) {
            return Response.error({ message: 'Failed to get project', errors: err.message });
        }
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Update project' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Progress updated successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to update progress' })
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProgressDto) {
        try {
            const result = await this.service.update(id, dto);
            return Response.success({ message: 'Progress updated successfully', data: result });
        } catch (err) {
            return Response.error({ message: 'Failed to update progress', errors: err.message });
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Delete project' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Progress deleted successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to deleted progress' })
    async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            await this.service.delete(id);
            return Response.success({ message: 'Progress deleted successfully' });
        } catch (err) {
            return Response.error({ message: 'Failed to delete progress', errors: err.message });
        }
    }
}