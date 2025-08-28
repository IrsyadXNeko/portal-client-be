import { Module } from '@nestjs/common';
import { NoticationController } from './notification/notification.contoroller';
import { NotificationService } from './notification/notification.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }
    })],
  controllers: [NoticationController],
  providers: [NotificationService],
})
export class AppModule {}
