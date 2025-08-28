import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Module({
    imports: [
        JwtModule.register({}),
        UserModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtAuthGuard],
})

export class AuthModule { }