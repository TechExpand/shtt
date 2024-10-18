import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShuttleOperatorController } from '../web/rest/shuttle-operator.controller';
import { ShuttleOperatorRepository } from '../repository/shuttle-operator.repository';
import { ShuttleOperatorService } from '../service/shuttle-operator.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([ShuttleOperatorRepository,JwtService])],
  controllers: [ShuttleOperatorController],
  providers: [ShuttleOperatorService,JwtService],
  exports: [ShuttleOperatorService,JwtService],
})
export class ShuttleOperatorModule {}
