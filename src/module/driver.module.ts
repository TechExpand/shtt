import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverController } from '../web/rest/driver.controller';
import { DriverRepository } from '../repository/driver.repository';
import { DriverService } from '../service/driver.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([DriverRepository,JwtService])],
  controllers: [DriverController],
  providers: [DriverService,JwtService],
  exports: [DriverService,JwtService],
})
export class DriverModule {}
