import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from '../web/rest/payment.controller';
import { PaymentRepository } from '../repository/payment.repository';
import { PaymentService } from '../service/payment.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/service/user.service';
import { UserRepository } from 'src/repository/user.repository';
import { VerifyRepository } from 'src/repository/verify.repository';
import { PinRepository } from 'src/repository/pin.repository';
import { NotificationRepository } from 'src/repository/notification.repository';


@Module({
  imports: [TypeOrmModule.forFeature([PaymentRepository,
    PinRepository,
    VerifyRepository,
    UserService,UserRepository,NotificationRepository,
    PinRepository,
    JwtService])],
  controllers: [PaymentController],
  providers: [PaymentService,JwtService,VerifyRepository,
    NotificationRepository,
     UserService, UserRepository],
  exports: [PaymentService,JwtService],
})
export class PaymentModule {}
