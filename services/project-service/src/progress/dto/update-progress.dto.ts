import { ApiProperty } from "@nestjs/swagger";

export class UpdateProgressDto {
  @ApiProperty({ example: '', description: '' })
  description: string;
}