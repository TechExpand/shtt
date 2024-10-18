import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperatorFareController } from '../web/rest/operator-fare.controller';
import { OperatorFareRepository } from '../repository/operator-fare.repository';
import { OperatorFareService } from '../service/operator-fare.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([OperatorFareRepository,JwtService])],
  controllers: [OperatorFareController],
  providers: [OperatorFareService,JwtService],
  exports: [OperatorFareService,JwtService],
})
export class OperatorFareModule {}
