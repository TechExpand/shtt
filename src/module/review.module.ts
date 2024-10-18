import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from '../web/rest/review.controller';
import { ReviewRepository } from '../repository/review.repository';
import { ReviewService } from '../service/review.service';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([ReviewRepository,JwtService])],
  controllers: [ReviewController],
  providers: [ReviewService,JwtService],
  exports: [ReviewService,JwtService],
})
export class ReviewModule {}
