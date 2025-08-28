import { ApiProperty } from "@nestjs/swagger";

export class CreateProjectDto {
  @ApiProperty({ example: '2', description: 'Client ID' })
  client_id: number;

  @ApiProperty({ example: 'Website Redesign', description: 'Name/Title project' })
  name: string;
  
  @ApiProperty({ example: 'Redesigning homepage', description: 'Description project' })
  description?: string;
  
  @ApiProperty({ example: '2025-08-01', description: 'Start date project, format: YYYY-MM-DD' })
  start_date?: string; // format: 'YYYY-MM-DD'
  
  @ApiProperty({ example: '2025-09-01', description: 'End date project, format: YYYY-MM-DD' })
  end_date?: string;
}