import { ApiProperty } from "@nestjs/swagger";

export class UpdateProjectDto {
  @ApiProperty({ example: 'Website Redesign', description: 'Name/Title project' })
  name?: string;
  
  @ApiProperty({ example: 'Redesigning homepage', description: 'Description project' })
  description?: string;
  
  @ApiProperty({ example: 'waiting', description: 'Status project, filled with "waiting | in_progress | completed | cancelled"' })
  status?: 'waiting' | 'in_progress' | 'completed' | 'cancelled';
  
  @ApiProperty({ example: '2025-08-01', description: 'Start date project, format: "YYYY-MM-DD"' })
  start_date?: string;
  
  @ApiProperty({ example: '2025-09-01', description: 'End date project, format: "YYYY-MM-DD"' })
  end_date?: string;
}