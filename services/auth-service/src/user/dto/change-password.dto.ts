import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
    @ApiProperty({ example: '1', description: 'User ID' })
    userId: number;

    @ApiProperty({ example: 'password123', description: 'Current password' })
    oldPassword: string;

    @ApiProperty({ example: 'password111', description: 'New password' })
    newPassword: string;
}