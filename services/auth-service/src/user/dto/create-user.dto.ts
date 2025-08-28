import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ example: 'admin or client', description: 'user role'})
    role: 'admin' | 'client';

    @ApiProperty({ example: 'client123', description: 'Username admin/client'})
    username: string;

    @ApiProperty({ example: 'client@example.com', description: 'User email' })
    email: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    password: string;
}