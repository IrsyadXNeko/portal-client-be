import { ApiProperty } from "@nestjs/swagger";

export class CreateRequestDto {
    @ApiProperty({example: '1', description: 'Client ID' })
    client_id: number;

    @ApiProperty({example: 'Together Company', description: 'New company name client' })
    new_company_name: string;

    @ApiProperty({example: 'Achmed', description: 'New contact person client' })
    new_contact_person: string;

    @ApiProperty({example: '081293847566', description: 'New phone nuber client' })
    new_phone: string;

    @ApiProperty({example: 'Blk 40 Mandalay Road', description: 'New address client' })
    new_address: string;
}
