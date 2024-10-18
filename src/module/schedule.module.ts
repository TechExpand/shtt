import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleController } from '../web/rest/schedule.controller';
import { ScheduleRepository } from '../repository/schedule.repository';
import { ScheduleService } from '../service/schedule.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([ScheduleRepository,JwtService])],
  controllers: [ScheduleController],
  providers: [ScheduleService,JwtService],
  exports: [ScheduleService,JwtService],
})
export class ScheduleModule {}
