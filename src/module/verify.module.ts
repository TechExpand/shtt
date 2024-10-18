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

@Module({
  imports: [TypeOrmModule.forFeature([Verifybs, VerifyRepository,JwtService])],
  controllers: [UserController, ManagementController],
  providers: [UserService, UserRepository,JwtService],
  exports: [UserService,JwtService]
})
export class VerifyModule {}
