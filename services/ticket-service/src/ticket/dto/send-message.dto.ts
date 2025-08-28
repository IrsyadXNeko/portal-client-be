import { ApiProperty } from "@nestjs/swagger";

export class SendMessageDto {
  @ApiProperty({ example: 'client', description: 'Sender role, filled with "client | admin"' })
  sender_role: 'client' | 'admin';

  @ApiProperty({ example: 'Thankyou, now i can open my invoice', description: 'Reply message ticket' })
  message: string;
}
