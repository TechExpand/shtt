import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckInController } from '../web/rest/check-in.controller';
import { CheckInRepository } from '../repository/check-in.repository';
import { CheckInService } from '../service/check-in.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([CheckInRepository,JwtService])],
  controllers: [CheckInController],
  providers: [CheckInService, JwtService],
  exports: [CheckInService, JwtService],
})
export class CheckInModule {}
