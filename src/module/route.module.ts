import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteController } from '../web/rest/route.controller';
import { RouteRepositorys } from '../repository/route.repository';
import { RouteService } from '../service/route.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/service/user.service';
import { UserRepository } from 'src/repository/user.repository';
import { VerifyRepository } from 'src/repository/verify.repository';
import { PointRepositorys } from 'src/repository/point.repository';
import { PointService } from 'src/service/point.service';
import { PinRepository } from 'src/repository/pin.repository';
import { TicketRepository } from 'src/repository/ticket.repository';
import { TicketService } from 'src/service/ticket.service';
import { SeatService } from 'src/service/seat.service';
import { SeatRepository } from 'src/repository/seat.repository';
import { NotificationRepository } from 'src/repository/notification.repository';


@Module({
  imports: [TypeOrmModule.forFeature([RouteRepositorys,
    NotificationRepository,
    TicketRepository,
    JwtService, UserService, UserRepository, VerifyRepository, 
    PointRepositorys, PointService, TicketService, SeatService, SeatRepository])],
  controllers: [RouteController],
  providers: [RouteService,JwtService, RouteRepositorys, SeatRepository,
    PinRepository,
    TicketRepository,SeatRepository,
    NotificationRepository,
    PointRepositorys, PointService,TicketService, SeatService,  
     UserService, UserRepository, VerifyRepository],
  exports: [RouteService,JwtService, RouteRepositorys, 
    PointRepositorys, PointService,SeatService,
    UserService, UserRepository, VerifyRepository],
})
export class RouteModule {}
