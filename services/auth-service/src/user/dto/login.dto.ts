import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ example: 'admin123', description: 'Username admin/client' })
    username: string;

    @ApiProperty({ example: 'password123', description: 'User password'})
    password: string;
}