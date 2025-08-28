export class Project {
  id: number;
  client_id: number;
  name: string;
  description: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  start_date: Date;
  end_date: Date;
  created_at: Date;
}