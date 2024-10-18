import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassengerController } from '../web/rest/passenger.controller';
import { PassengerRepository } from '../repository/passenger.repository';
import { PassengerService } from '../service/passenger.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([PassengerRepository,JwtService])],
  controllers: [PassengerController],
  providers: [PassengerService,JwtService],
  exports: [PassengerService,JwtService],
})
export class PassengerModule {}
