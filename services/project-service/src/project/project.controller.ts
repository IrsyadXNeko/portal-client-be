import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";
import { AdminGuard } from "src/common/guards/admin.guard";
import { ClientGuard } from "src/common/guards/client.guard";
import { sendNotification } from "src/common/helpers/notification.helper";
import { Response } from "src/common/helpers/response.helper";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Project')
@Controller('Projects')
export class ProjectController {
    constructor(private readonly service: ProjectService) { }

    @Post()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Create project' })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Project created successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to create project' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Client ID is invalid' })
    async create(@Body() dto: CreateProjectDto) {
        try {
            const result = await this.service.create(dto);
            return Response.created('Project created successfully', result);
        } catch (err) {
            return Response.error({ message: 'Failed to create project', errors: err.message });
        }
    }

    @Get()
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Get all project' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Get projects successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to get projects' })
    async findProjects() {
        try {
            const result = await this.service.findProjects();
            return Response.success({ message: 'Get projects successfully', data: result });
        } catch (err) {
            return Response.error({ message: 'Failed to get projects', errors: err.message });
        }
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Get 1 project' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Get project successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to get project' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Project not found' })
    async findById(@Param('id', ParseIntPipe) id: number) {
        try {
            const result = await this.service.findById(id);
            if (!result) return Response.notFound('Project not found');
            return Response.success({ message: 'Get project successfully', data: result });
        } catch (err) {
            return Response.error({ message: 'Failed to get project', errors: err.message });
        }
    }

    @Get('client/:clientId')
    @UseGuards(JwtAuthGuard, ClientGuard)
    @ApiOperation({ summary: 'Get 1 project for client' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Get project successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to get project' })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden: You can only access your own projects' })
    async findByClientId(@Param('id', ParseIntPipe) clientId: number, @Req() req) {
        try {
            if (clientId !== req.user.client_id) return Response.forbidden('Forbidden: You can only access your own projects');

            const result = await this.service.findByClientId(clientId);
            return Response.success({ message: 'Get project successfully', data: result });
        } catch (err) {
            return Response.error({ message: 'Failed to get project', errors: err.message });
        }
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Update project' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Update project successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to update project' })
    async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProjectDto) {
        try {
            const result = await this.service.update(id, dto);

            await sendNotification(
                result.client_id,
                `Project Status Updated`,
                `<p>Dear Client,</p><p>Your project "<b>${result.title}</b>" status has been updated to: <b>${dto.status}</b>.</p>`
            );

            return Response.success({ message: 'Update project successfully', data: result });
        } catch (err) {
            return Response.error({ message: 'Failed to update project', errors: err.message });
        }
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, AdminGuard)
    @ApiOperation({ summary: 'Delete project' })
    @ApiResponse({ status: HttpStatus.OK, description: 'Delete project successfully' })
    @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to delete project' })
    async delete(@Param('id', ParseIntPipe) id: number) {
        try {
            const result = await this.service.delete(id);
            return Response.success({ message: 'Delete project successfully' });
        } catch (err) {
            return Response.error({ message: 'Failed to delete project', errors: err.message });
        }
    }
}