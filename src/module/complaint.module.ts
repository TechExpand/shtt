import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplaintController } from '../web/rest/complaint.controller';
import { ComplaintRepository } from '../repository/complaint.repository';
import { ComplaintService } from '../service/complaint.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([ComplaintRepository,JwtService])],
  controllers: [ComplaintController],
  providers: [ComplaintService,JwtService],
  exports: [ComplaintService,JwtService],
})
export class ComplaintModule {}
