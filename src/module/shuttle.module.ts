import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShuttleController } from '../web/rest/shuttle.controller';
import { ShuttleRepository } from '../repository/shuttle.repository';
import { ShuttleService } from '../service/shuttle.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([ShuttleRepository, JwtService])],
  controllers: [ShuttleController],
  providers: [ShuttleService, JwtService],
  exports: [ShuttleService, JwtService],
})
export class ShuttleModule {}
