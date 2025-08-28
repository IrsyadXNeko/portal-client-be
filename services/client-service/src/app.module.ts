import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ClientService } from './client/client.service';
import { ClientController } from './client/client.controller';
import { BiodataRequestController } from './biodata-request/biodata-request.controller';
import { BiodataRequestService } from './biodata-request/biodata-request.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN }
    })
  ],
  controllers: [ClientController, BiodataRequestController],
  providers: [ClientService, BiodataRequestService],
})

export class AppModule {}
