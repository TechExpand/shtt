import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteController } from '../web/rest/route.controller';
import { RouteRepositorys } from '../repository/route.repository';
import { RouteService } from '../service/route.service';
import { JwtService } from '@nestjs/jwt';
import { RoleRepository } from 'src/repository/role.repository';
import { RoleService } from 'src/service/role.service';
import { UserRepository } from 'src/repository/user.repository';
import { UserService } from 'src/service/user.service';
import { VerifyRepository } from 'src/repository/verify.repository';
import { PointService } from 'src/service/point.service';
import { PointRepositorys } from 'src/repository/point.repository';
import { PinRepository } from 'src/repository/pin.repository';
import { TicketRepository } from 'src/repository/ticket.repository';
import { TicketService } from 'src/service/ticket.service';
import { SeatService } from 'src/service/seat.service';
import { SeatRepository } from 'src/repository/seat.repository';
import { NotificationRepository } from 'src/repository/notification.repository';


@Module({
  imports: [TypeOrmModule.forFeature([RoleRepository,
    TicketRepository, TicketService,
    JwtService,RouteService, RouteRepositorys, NotificationRepository,
    SeatService,
    UserService, UserRepository, VerifyRepository, SeatRepository,])],
  controllers: [RouteController],
  providers: [RoleService,JwtService,RouteService,
    TicketService, NotificationRepository,
    TicketRepository,
    PointRepositorys, PointService, PinRepository,SeatService,SeatRepository,
    RouteRepositorys, UserService, UserRepository, VerifyRepository],
  exports: [RoleService,JwtService,RouteService, RouteRepositorys, UserService, UserRepository, VerifyRepository],
})
export class RoleModule {}
