export interface TicketMessage {
  id: number;
  ticket_id: number;
  sender_role: 'client' | 'admin';
  message: string;
  created_at: string;
}
