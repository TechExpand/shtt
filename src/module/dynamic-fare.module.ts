import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicFareController } from '../web/rest/dynamic-fare.controller';
import { DynamicFareRepository } from '../repository/dynamic-fare.repository';
import { DynamicFareService } from '../service/dynamic-fare.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([DynamicFareRepository,JwtService])],
  controllers: [DynamicFareController],
  providers: [DynamicFareService,JwtService],
  exports: [DynamicFareService,JwtService],
})
export class DynamicFareModule {}
