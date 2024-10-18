import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatController } from '../web/rest/seat.controller';
import { SeatRepository } from '../repository/seat.repository';
import { SeatService } from '../service/seat.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([SeatRepository,JwtService])],
  controllers: [SeatController],
  providers: [SeatService,JwtService,
      ],
  exports: [SeatService, JwtService,
    ],
})
export class SeatModule {}
