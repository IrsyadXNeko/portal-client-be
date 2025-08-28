export interface Ticket {
  id: number;
  client_id: number;
  subject: string;
  status: 'open' | 'closed';
  created_at: string;
  updated_at: string;
}
