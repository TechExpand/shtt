import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketController } from '../web/rest/ticket.controller';
import { TicketRepository } from '../repository/ticket.repository';
import { TicketService } from '../service/ticket.service';
import { JwtService } from '@nestjs/jwt';
import { RoleRepository } from 'src/repository/role.repository';
import { RoleService } from 'src/service/role.service';
import { UserService } from 'src/service/user.service';
import { UserRepository } from 'src/repository/user.repository';
import { VerifyRepository } from 'src/repository/verify.repository';
import { SeatController } from 'src/web/rest/seat.controller';
import { SeatService } from 'src/service/seat.service';
import { SeatRepository } from 'src/repository/seat.repository';
import { PinRepository } from 'src/repository/pin.repository';
import { RouteService } from 'src/service/route.service';
import { RouteRepositorys } from 'src/repository/route.repository';
import { PointService } from 'src/service/point.service';
import { PointRepositorys } from 'src/repository/point.repository';
import { NotificationRepository } from 'src/repository/notification.repository';


@Module({
  imports: [TypeOrmModule.forFeature([
    PointRepositorys, PointService,
    TicketRepository,JwtService, RouteRepositorys,
    UserService, RoleRepository, RoleService, RouteService, 
    NotificationRepository,
    VerifyRepository, UserRepository,SeatController, SeatService, SeatRepository])],
  controllers: [TicketController],
  providers: [TicketService,JwtService,
    PointRepositorys, PointService,
    UserRepository,PinRepository,RouteService, RouteRepositorys,
     TicketRepository, UserService,  RoleRepository, VerifyRepository,
     NotificationRepository,
     RoleService, SeatController, SeatService, SeatRepository],
  exports: [TicketService,JwtService, 
    UserRepository,
    UserService, TicketRepository,  RoleRepository, VerifyRepository, RoleService, SeatController, SeatService, SeatRepository],
})
export class TicketModule {}
