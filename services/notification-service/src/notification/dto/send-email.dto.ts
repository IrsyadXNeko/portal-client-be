import { ApiProperty } from "@nestjs/swagger";

export class SendEmailDto {
    @ApiProperty({ example: '1', description: 'Receiver client id' })
    toClientId?: number;

    @ApiProperty({ example: 'email@example.com', description: 'Receiver client email' })
    email?: string;
    
    @ApiProperty({ example: 'Reminder: Your invoice is due tomorrow', description: 'Subject email' })
    subject: string;
    
    @ApiProperty({ example: '<p>Hi, please remember to pay your invoice before the due date.</p>', description: 'Message email' })
    message: string;
}