import { Module } from '@nestjs/common';
import { UserController } from '../web/rest/user.controller';
import { ManagementController } from '../web/rest/management.controller';
import { UserRepository } from '../repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../service/user.service';
import { User } from 'src/domain/user.entity';
import { Verifybs } from 'src/domain/verify.entity';
import { VerifyRepository } from 'src/repository/verify.repository';
import { JwtService } from '@nestjs/jwt';
import { Rolebs } from 'src/domain/role.entity';
import { SeatRepository } from 'src/repository/seat.repository';
import { SeatService } from 'src/service/seat.service';
import { PinRepository } from 'src/repository/pin.repository';
import { NotificationRepository } from 'src/repository/notification.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User,Verifybs,Rolebs, 
    NotificationRepository,
    SeatRepository, SeatService,
    UserRepository, VerifyRepository, JwtService])],
  controllers: [UserController, ManagementController],
  providers: [UserService, UserRepository, 
    PinRepository,
    VerifyRepository, JwtService, SeatRepository, SeatService, NotificationRepository],
  exports: [UserService,  JwtService, SeatRepository, SeatService]
})
export class UserModule {}

