import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperatorLogController } from '../web/rest/operator-log.controller';
import { OperatorLogRepository } from '../repository/operator-log.repository';
import { OperatorLogService } from '../service/operator-log.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([OperatorLogRepository,JwtService])],
  controllers: [OperatorLogController],
  providers: [OperatorLogService,JwtService],
  exports: [OperatorLogService,JwtService],
})
export class OperatorLogModule {}
