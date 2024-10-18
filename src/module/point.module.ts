import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointController } from '../web/rest/point.controller';
import { PointRepositorys } from '../repository/point.repository';
import { PointService } from '../service/point.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([PointRepositorys,JwtService])],
  controllers: [PointController],
  providers: [PointService,JwtService],
  exports: [PointService,JwtService],
})
export class StopModule {}
