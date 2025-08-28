import { ApiProperty } from "@nestjs/swagger";

export class UpdateClientDto {
    @ApiProperty({ example: 'PT GrowUp', description: 'Company name client' })
    company_name?: string;

    @ApiProperty({ example: 'Ahmed', description: 'Contact person client' })
    contact_person?: string;

    @ApiProperty({ example: '081298763456', description: 'Phone number client' })
    phone?: string;

    @ApiProperty({ example: 'Blk 35 Mandalay Road', description: 'Address client' })
    address?: string;
}
