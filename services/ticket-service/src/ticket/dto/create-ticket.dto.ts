import { ApiProperty } from "@nestjs/swagger";

export class CreateTicketDto {
  @ApiProperty({ example: '1', description: 'Client ID' })
  client_id: number;

  @ApiProperty({ example: 'Can not access invoice', description: 'Subject ticket' })
  subject: string;
  
  @ApiProperty({ example: 'I can not open my invoice', description: 'Message Ticket' })
  message: string; // pesan pertama saat membuat tiket
}
