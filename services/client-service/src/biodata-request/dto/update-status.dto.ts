import { ApiProperty } from "@nestjs/swagger";

export class UpdateStatusDto {
    @ApiProperty({ example: 'approved', description: 'Status biodata request client, filled with "approved | rejected"'})
    status: 'approved' | 'rejected';
}
