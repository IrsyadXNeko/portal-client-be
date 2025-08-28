import { db } from '../database';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { SendMessageDto } from './dto/send-message.dto';

export class TicketRepository {
  async createTicket(dto: CreateTicketDto) {
    const ticket = await db.query(
      `INSERT INTO pc_tickets (client_id, subject) VALUES ($1, $2) RETURNING *`,
      [dto.client_id, dto.subject],
    );

    const ticket_id = ticket.rows[0].id;

    await db.query(
      `INSERT INTO pc_ticket_messages (ticket_id, sender_role, message) VALUES ($1, 'client', $2)`,
      [ticket_id, dto.message],
    );

    return ticket.rows[0];
  }

  async getAllTickets() {
    const res = await db.query(`SELECT * FROM pc_tickets ORDER BY created_at DESC`);
    return res.rows;
  }

  async getClientTickets(client_id: number) {
    const res = await db.query(
      `SELECT * FROM pc_tickets WHERE client_id = $1 ORDER BY created_at DESC`,
      [client_id],
    );
    return res.rows;
  }

  async getMessages(ticket_id: number) {
    const res = await db.query(
      `SELECT * FROM pc_ticket_messages WHERE ticket_id = $1 ORDER BY created_at ASC`,
      [ticket_id],
    );
    return res.rows;
  }

  async addMessage(ticket_id: number, dto: SendMessageDto) {
    const res = await db.query(
      `INSERT INTO pc_ticket_messages (ticket_id, sender_role, message) VALUES ($1, $2, $3) RETURNING *`,
      [ticket_id, dto.sender_role, dto.message],
    );
    return res.rows[0];
  }

  async closeTicket(ticket_id: number) {
    const res = await db.query(
      `UPDATE pc_tickets SET status = 'closed', updated_at = NOW() WHERE id = $1 RETURNING *`,
      [ticket_id],
    );
    return res.rows[0];
  }

  async delete(ticket_id: number) {
    await db.query(`DELETE FROM pc_tickets WHERE id = $1`, [ticket_id],);
  }
}
