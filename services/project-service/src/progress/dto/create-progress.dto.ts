import { ApiProperty } from "@nestjs/swagger";

export class CreateProgressDto {
  @ApiProperty({ example: '1', description: 'Project ID' })
  project_id: number;

  @ApiProperty({ example: 'Design phase started', description: 'Description progress project' })
  description: string;
}