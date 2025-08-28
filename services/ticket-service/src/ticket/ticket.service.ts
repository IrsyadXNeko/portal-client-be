import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { TicketRepository } from './ticket.repository';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class TicketService {
  private readonly repo = new TicketRepository();

  async create(dto: CreateTicketDto) {
    return await this.repo.createTicket(dto);
  }

  async findAll() {
    return await this.repo.getAllTickets();
  }

  async findByClient(client_id: number) {
    return await this.repo.getClientTickets(client_id);
  }

  async getMessages(ticket_id: number) {
    const messages = await this.repo.getMessages(ticket_id);
    if (!messages || messages.length === 0) {
      throw new HttpException('No messages found for this ticket', HttpStatus.NOT_FOUND);
    }
    return messages;
  }

  async sendMessage(ticket_id: number, dto: SendMessageDto) {
    return await this.repo.addMessage(ticket_id, dto);
  }

  async closeTicket(ticket_id: number) {
    const ticket = await this.repo.closeTicket(ticket_id);
    if (!ticket) throw new HttpException('Ticket not found', HttpStatus.NOT_FOUND);
    return ticket;
  }

  async delete(ticket_id: number) {
    await this.repo.delete(ticket_id);
  }
}
