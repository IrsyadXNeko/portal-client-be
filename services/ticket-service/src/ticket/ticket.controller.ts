import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { TicketService } from './ticket.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { ClientGuard } from '../common/guards/client.guard';
import { Response } from 'src/common/helpers/response.helper';
import { sendNotification } from 'src/common/helpers/notification.helper';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Ticket')
@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @UseGuards(ClientGuard)
  @ApiOperation({ summary: 'Created ticket' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Ticket created successfully' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to create ticket' })
  async create(@Body() dto: CreateTicketDto) {
    try {
      const ticket = await this.ticketService.create(dto);
      return Response.created('Ticket created successfully', ticket);
    } catch (err) {
      return Response.error({ message: 'Failed to create ticket', errors: err.message });
    }
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all ticket' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Get tickets successfully' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to fetch tickets' })
  async findAll() {
    try {
      const tickets = await this.ticketService.findAll();
      return Response.success({ message: 'Get tickets successfully', data: tickets });
    } catch (err) {
      return Response.error({ message: 'Failed to fetch tickets', errors: err.message });
    }
  }

  @Get('client/:id')
  @UseGuards(ClientGuard)
  @ApiOperation({ summary: 'Get 1 ticket for client' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Get ticket successfully' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to fetch ticket' })
  async findByClient(@Param('id') id: string) {
    try {
      const tickets = await this.ticketService.findByClient(+id);
      return Response.success({ message: 'Get ticket successfully', data: tickets });
    } catch (err) {
      return Response.error({ message: 'Failed to fetch tickets', errors: err.message });
    }
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get message ticket' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Get messages successfully' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to fetch messages' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'No messages found for this ticket' })
  async getMessages(@Param('id') id: string) {
    try {
      const messages = await this.ticketService.getMessages(+id);
      return Response.success({ message: 'Get messages successfully', data: messages });
    } catch (err) {
      return Response.error({ message: 'Failed to fetch messages', errors: err.message });
    }
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Reply message ticket' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Message sent' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to send message' })
  async sendMessage(@Param('id') id: string, @Body() dto: SendMessageDto, @Req() req) {
    try {
      const message = await this.ticketService.sendMessage(+id, dto);
      
      if (req.user && req.user.role === 'admin') {
      await sendNotification(
        message.client_id,
        `Reply to your ticket #${id}`,
        `<p>Dear Client,</p><p>Admin has replied to your ticket "<b>${message.subject}</b>".</p><p>Message: ${dto.message}</p>`
      );
    }

      return Response.success({ message: 'Message sent', data: message });
    } catch (err) {
      return Response.error({ message: 'Failed to send message', errors: err.message });
    }
  }

  @Put(':id/close')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update status ticket' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Ticket closed' })
  @ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Failed to close ticket' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Ticket not found' })
  async closeTicket(@Param('id') id: string) {
    try {
      const ticket = await this.ticketService.closeTicket(+id);
      return Response.success({ message: 'Ticket closed', data: ticket });
    } catch (err) {
      return Response.error({ message: 'Failed to close ticket', errors: err.message });
    }
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete ticket (Only use for internal service)' })
  async delete(@Param('id') id: string) {
    try {
      await this.ticketService.delete(+id);
      return Response.success({ message: 'Ticket deleted'});
    } catch (err) {
      return Response.error({ message: 'Failed to delete ticket', errors: err.message });
    }
  }
}
