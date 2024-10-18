import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { TicketDTO } from '../service/dto/ticket.dto';
import { TicketMapper } from '../service/mapper/ticket.mapper';
import { TicketRepository } from '../repository/ticket.repository';
import { UserRepository } from 'src/repository/user.repository';
import { UserService } from './user.service';
import { SeatService } from './seat.service';
import { makeid, uniqueRandomNumberInRange } from 'src/utils/sms';
import { SeatDTO } from './dto/seat.dto';
import { ScheduleDTO } from './dto/schedule.dto';
import { RouteService } from './route.service';
import { RouteDTO } from './dto/route.dto';
import { RouteMapper } from './mapper/route.mapper';
import { RouteRepositorys } from 'src/repository/route.repository';
import { UserDTO } from './dto/user.dto';
import { NotificationRepository } from 'src/repository/notification.repository';
import { NotificationDTO } from './dto/notification.dto';
import { Redis } from 'src/utils/redis';
import { sendNotification } from 'src/utils/notification';

const relationshipNames = [];
relationshipNames.push('passenger');
relationshipNames.push('schedule');


@Injectable()
export class TicketService {
  logger = new Logger('TicketService');

  constructor(@InjectRepository(TicketRepository)
  private ticketbsRepository: TicketRepository,
    private userService: UserService,
    private routebsRepository: RouteRepositorys,
    private routeService: RouteService,
    private seatService: SeatService,
    private userRepository: UserRepository,
    private notificationRepository: NotificationRepository


  ) { }

  async findById(id: number): Promise<TicketDTO | undefined> {
    const options = { relations: ["user", "driver", "route", "points"] };
    const result = await this.ticketbsRepository.findOne({ where: { id }, ...options });
    const resultDTO = TicketMapper.fromEntityToDTO(result);
    return resultDTO;
  }

  async findByFields(options: FindOneOptions<TicketDTO>): Promise<TicketDTO | undefined> {
    const result = await this.ticketbsRepository.findOne(options);
    return TicketMapper.fromEntityToDTO(result);
  }

  async findAndCount(options: FindManyOptions<TicketDTO>): Promise<[TicketDTO[], number]> {
    options.relations = ["user", "driver", "route", "points", "route.points"];
    const resultList = await this.ticketbsRepository.findAndCount(options);
    const ticketbsDTO: TicketDTO[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(ticketbs => ticketbsDTO.push(TicketMapper.fromEntityToDTO(ticketbs)));
      resultList[0] = ticketbsDTO;
    }
    return resultList;
  }

  async save(ticketbsDTO: any, creator?: string): Promise<TicketDTO | undefined | any> {
    const entity = TicketMapper.fromDTOtoEntity(ticketbsDTO);
    let routebsDTO = new RouteDTO();
    let notificationDTO1 = new NotificationDTO();
    let notificationDTO2 = new NotificationDTO();
    if (creator) {
      if (!entity.createdBy) {
        entity.createdBy = creator;
      }
      entity.lastModifiedBy = creator;
    }

    // ticketNumber, seatNumber, points[], status, userId, routeId, driverId, 
    // route, user , driver
    const userFind = await this.userService.findByFields({ where: { id: ticketbsDTO.userId } });
    const routeFind = await this.routeService.findByFields({ where: { id: ticketbsDTO.routeId }, relations: ['points'] });
    const driverFind = await this.userService.findByFields({ where: { id: ticketbsDTO.driverId } });


    if (ticketbsDTO.type == "WALLET") {

      if (userFind.walletBalance >= ticketbsDTO.price) {
        await this.userRepository.update(ticketbsDTO.userId, {
          walletBalance: userFind.walletBalance - ticketbsDTO.price
        });

        let nextAvailableSeat;
        if (routeFind.resheduledSits.length != 0) {
          const value = routeFind.resheduledSits.shift()
          nextAvailableSeat = value;
          const index = routeFind.resheduledSits.indexOf(value);
          if (index > -1) {
            routeFind.resheduledSits.splice(index, 1);
          }
          routebsDTO.resheduledSits = routeFind.resheduledSits;
          routebsDTO.bookedSits = routeFind.bookedSits.concat([value]);
          // routebsDTO.bookedSits = [];


        } else {

          // routebsDTO.bookedSits = [];
          routebsDTO.bookedSits = routeFind.bookedSits.concat([(Number(routeFind.nextAvailableSeat))])

        }

        entity.user = userFind;
        // entity.status = "BOOKED";
        entity.userId = userFind.id;
        entity.seatNumber = nextAvailableSeat ? nextAvailableSeat : routeFind.nextAvailableSeat;
        entity.routeId = routeFind.id;
        entity.route = routeFind;
        entity.points = routeFind.points;
        entity.ticketNumber = makeid(8).toUpperCase()
        entity.driver = driverFind;
        entity.driverId = driverFind.id;
        const result = await this.ticketbsRepository.save(entity);
        routebsDTO.points = routeFind.points
        routebsDTO.distance = routeFind.distance
        routebsDTO.dropoffLan = routeFind.dropoffLan
        routebsDTO.price = ticketbsDTO.price
        routebsDTO.maximumSeat = routeFind.maximumSeat
        routebsDTO.nextAvailableSeat = (Number(routeFind.nextAvailableSeat) + 1)
        routebsDTO.dropoffLog = routeFind.dropoffLog
        routebsDTO.pickupLan = routeFind.pickupLan
        routebsDTO.pickupLog = routeFind.pickupLog
        routebsDTO.userId = routeFind.userId
        routebsDTO.id = routeFind.id
        routebsDTO.user = routeFind.user
        routebsDTO.pickupLocation = routeFind.pickupLocation
        routebsDTO.dropoffLocation = routeFind.dropoffLocation
        notificationDTO1.message = `Booked a ticket with ${driverFind.firstName}, with seat number ${entity.seatNumber}`;
        notificationDTO1.user = userFind;
        notificationDTO1.userId = userFind.id;
        notificationDTO2.message = `${userFind.firstName} Booked a ticket, with seat number ${entity.seatNumber} `;
        notificationDTO2.user = driverFind;
        notificationDTO2.userId = driverFind.id;
        await sendNotification(notificationDTO1.user.fcmToken, "ShuttlesNet", `Booked a ticket with ${driverFind.firstName}, with seat number ${entity.seatNumber}`)
        await sendNotification(notificationDTO2.user.fcmToken, "ShuttlesNet", `${userFind.firstName} Booked a ticket, with seat number ${entity.seatNumber} `)
        await this.notificationRepository.save(notificationDTO1)
        await this.notificationRepository.save(notificationDTO2)
        const entity_new = RouteMapper.fromDTOtoEntity(routebsDTO);
        const result_new = await this.routebsRepository.save(entity_new);
        await this.userRepository.update(ticketbsDTO.driverId, {
          walletBalance: userFind.walletBalance + ticketbsDTO.price
        });
        const redis = new Redis();
        const previousAmount = await redis.getData(`earn-${userFind!.id}`);
        const todayEnd = new Date().setHours(23, 59, 59);
        const expire = Math.floor((todayEnd - Date.now()) / 1000);
        await redis.setData(`earn-${userFind!.id}`, (Number(previousAmount) + Number(ticketbsDTO.price)).toString(), expire);


        return TicketMapper.fromEntityToDTO(result);

      } else {
        return { message: "Insufficient funds" }
      }
    } else {

      let nextAvailableSeat;
      if (routeFind.resheduledSits.length != 0) {
        const value = routeFind.resheduledSits.shift()
        nextAvailableSeat = value;
        const index = routeFind.resheduledSits.indexOf(value);
        if (index > -1) {
          routeFind.resheduledSits.splice(index, 1);
        }
        routebsDTO.resheduledSits = routeFind.resheduledSits;
        routebsDTO.bookedSits = routeFind.bookedSits.concat([value]);

      } else {
        routebsDTO.bookedSits = routeFind.bookedSits.concat([(Number(routeFind.nextAvailableSeat))])
      }

      entity.user = userFind;
      // entity.status = "BOOKED";
      entity.userId = userFind.id;
      entity.seatNumber = nextAvailableSeat ? nextAvailableSeat : routeFind.nextAvailableSeat;
      entity.routeId = routeFind.id;
      entity.route = routeFind;
      entity.points = routeFind.points;
      entity.ticketNumber = makeid(8).toUpperCase()
      entity.driver = driverFind;
      entity.driverId = driverFind.id;
      const result = await this.ticketbsRepository.save(entity);
      routebsDTO.points = routeFind.points
      routebsDTO.distance = routeFind.distance
      routebsDTO.dropoffLan = routeFind.dropoffLan
      routebsDTO.price = routeFind.price
      routebsDTO.maximumSeat = routeFind.maximumSeat


      routebsDTO.nextAvailableSeat = (Number(routeFind.nextAvailableSeat) + 1)
      // routebsDTO.bookedSits = routeFind.bookedSits.concat([(Number(routeFind.nextAvailableSeat))])
      routebsDTO.dropoffLog = routeFind.dropoffLog
      routebsDTO.pickupLan = routeFind.pickupLan
      routebsDTO.pickupLog = routeFind.pickupLog
      routebsDTO.userId = routeFind.userId
      routebsDTO.id = routeFind.id
      routebsDTO.user = routeFind.user
      routebsDTO.pickupLocation = routeFind.pickupLocation
      routebsDTO.dropoffLocation = routeFind.dropoffLocation
      notificationDTO1.message = `Booked a ticket with ${driverFind.firstName}, with seat number ${entity.seatNumber}`;
      notificationDTO1.user = userFind;
      notificationDTO1.userId = userFind.id;
      notificationDTO2.message = `${userFind.firstName} Booked a ticket, with seat number ${entity.seatNumber} `;
      notificationDTO2.user = driverFind;
      notificationDTO2.userId = driverFind.id;
      await sendNotification(notificationDTO1.user.fcmToken, "ShuttlesNet", `Booked a ticket with ${driverFind.firstName}, with seat number ${entity.seatNumber}`)
      await sendNotification(notificationDTO2.user.fcmToken, "ShuttlesNet", `${userFind.firstName} Booked a ticket, with seat number ${entity.seatNumber} `)
      await this.notificationRepository.save(notificationDTO2)
      await this.notificationRepository.save(notificationDTO1)
      const entity_new = RouteMapper.fromDTOtoEntity(routebsDTO);
      const result_new = await this.routebsRepository.save(entity_new);
      await this.userRepository.update(ticketbsDTO.driverId, {
        walletBalance: userFind.walletBalance + ticketbsDTO.price
      });
      const redis = new Redis();
      const previousAmount = await redis.getData(`earn-${userFind!.id}`);
      const todayEnd = new Date().setHours(23, 59, 59);
      const expire = Math.floor((todayEnd - Date.now()) / 1000);
      await redis.setData(`earn-${userFind!.id}`, (Number(previousAmount) + Number(ticketbsDTO.price)).toString(), expire);
      return TicketMapper.fromEntityToDTO(result);


    }

  }




  async updateStatus(id: number, status: string): Promise<any> {
    // options.relations = relationshipNames;
    const result = await this.ticketbsRepository.findOne({ where: { id } });
    let notificationDTO1 = new NotificationDTO();
    let notificationDTO2 = new NotificationDTO();
    notificationDTO1.message = `Ticket number ${result.id}, was updated to ${status}`;
    notificationDTO1.user = result.user;
    notificationDTO1.userId = result.userId;
    notificationDTO2.message = `Ticket number ${result.id}, was updated to ${status}`;
    notificationDTO2.user = result.driver;
    notificationDTO2.userId = result.driverId;
    await this.notificationRepository.save(notificationDTO2)
    await this.notificationRepository.save(notificationDTO1)
    await sendNotification(notificationDTO1.user.fcmToken, "ShuttlesNet", `Ticket number ${result.id}, was updated to ${status}`)
    await sendNotification(notificationDTO2.user.fcmToken, "ShuttlesNet", `Ticket number ${result.id}, was updated to ${status}`)
    if (!result) return false;
    await this.ticketbsRepository.update(id, { status });
    return true;
  }




  async resheduleTicket(id: number, routeId: number,
    newrouteId: number, seatNumber: number, userId: number): Promise<any> {
    const userFind = await this.userService.findByFields({ where: { id: userId } });
    if (userFind.walletBalance >= 10) {

      // options.relations = relationshipNames;
      const routeFind = await this.routeService.findByFields({ where: { id: newrouteId }, relations: ['points'] });
      const result = await this.ticketbsRepository.findOne({ where: { id } });
      const result2 = await this.routebsRepository.findOne({ where: { id: routeId } });

      if (!result) return { status: true };
      // await this.ticketbsRepository.update(id,  {seatNumber });
      let removeDuplicate = result2.resheduledSits.concat(seatNumber)
      let newlist = [...new Set(removeDuplicate)];


      const index = result2.bookedSits.indexOf(seatNumber);
      if (index > -1) {
        result2.bookedSits.splice(index, 1);
      }



      let nextAvailableSeat;
      let resheduledSits = [];
      let bookedSits = [];

      nextAvailableSeat = (Number(routeFind.nextAvailableSeat) + 1)
      resheduledSits = [];
      bookedSits = [nextAvailableSeat];

      if (routeFind.resheduledSits.length != 0) {
        const value = routeFind.resheduledSits.shift()
        nextAvailableSeat = value;
        const index = routeFind.resheduledSits.indexOf(value);
        if (index > -1) {
          routeFind.resheduledSits.splice(index, 1);
        }

        resheduledSits = routeFind.resheduledSits;
        bookedSits = routeFind.bookedSits.concat([value]);
      }

      let notificationDTO1 = new NotificationDTO();
      let notificationDTO2 = new NotificationDTO();
      notificationDTO1.message = `Ticket number ${result.id}, was rescheduled.`;
      notificationDTO1.user = result.user;
      notificationDTO1.userId = result.userId;
      notificationDTO2.message = `Ticket number ${result.id}, was rescheduled.`;
      notificationDTO2.user = result.driver;
      notificationDTO2.userId = result.driverId;
      await sendNotification(notificationDTO1.user.fcmToken, "ShuttlesNet", `Ticket number ${result.id}, was rescheduled.`)
      await sendNotification(notificationDTO2.user.fcmToken, "ShuttlesNet", `Ticket number ${result.id}, was rescheduled.`)
      await this.notificationRepository.save(notificationDTO2)
      await this.notificationRepository.save(notificationDTO1)
      await this.userRepository.update(userId, {
        walletBalance: userFind.walletBalance - 10
      });
      await this.routebsRepository.update(routeId,
        { resheduledSits: newlist, bookedSits: result2.bookedSits });
      await this.routebsRepository.update(newrouteId,
        { resheduledSits, bookedSits });
      await this.ticketbsRepository.update(id, {
        route: routeFind,
        routeId: newrouteId,
        seatNumber: nextAvailableSeat ? nextAvailableSeat : routeFind.nextAvailableSeat
      })
      return { status: true };
    }
    else {
      return { message: "Insufficient funds" }
    }



  }







  async cancelTicket(id: number, routeId: number,
    seatNumber: number, userId: number): Promise<any> {
    const userFind = await this.userService.findByFields({ where: { id: userId } });
    if (userFind.walletBalance >= 10) {

      // options.relations = relationshipNames;
      const routeFind = await this.routeService.findByFields({ where: { id: routeId }, relations: ['points'] });
      const result = await this.ticketbsRepository.findOne({ where: { id } });
      const driverFind = await this.userService.findByFields({ where: { id: result.driverId } });

      if (!result) return { status: true };
      // await this.ticketbsRepository.update(id,  {seatNumber });
      let removeDuplicate = routeFind.resheduledSits.concat(seatNumber)
      let newlist = [...new Set(removeDuplicate)];


      const index = routeFind.bookedSits.indexOf(seatNumber);
      if (index > -1) {
        routeFind.bookedSits.splice(index, 1);
      }

      let notificationDTO1 = new NotificationDTO();
      let notificationDTO2 = new NotificationDTO();
      notificationDTO1.message = `Ticket number ${result.id}, was canceled.`;
      notificationDTO1.user = result.user;
      notificationDTO1.userId = result.userId;
      notificationDTO2.message = `Ticket number ${result.id}, was canceled.`;
      notificationDTO2.user = result.driver;
      notificationDTO2.userId = result.driverId;
      await sendNotification(notificationDTO1.user.fcmToken, "ShuttlesNet", `Ticket number ${result.id}, was canceled.`)
      await sendNotification(notificationDTO2.user.fcmToken, "ShuttlesNet", `Ticket number ${result.id}, was canceled.`)
      await this.notificationRepository.save(notificationDTO2)
      await this.notificationRepository.save(notificationDTO1)

      let nextAvailableSeat;
      let resheduledSits = [];
      let bookedSits = [];

      nextAvailableSeat = (Number(routeFind.nextAvailableSeat) + 1)
      resheduledSits = [];
      bookedSits = [nextAvailableSeat];

      if (routeFind.resheduledSits.length != 0) {
        const value = routeFind.resheduledSits.shift()
        nextAvailableSeat = value;
        const index = routeFind.resheduledSits.indexOf(value);
        if (index > -1) {
          routeFind.resheduledSits.splice(index, 1);
        }

        resheduledSits = routeFind.resheduledSits;
        bookedSits = routeFind.bookedSits.concat([value]);
      }

      await this.userRepository.update(userId, {
        walletBalance: ((userFind.walletBalance - 10) + (result.amount))
      });

      await this.userRepository.update(result.driverId, {
        walletBalance: ((driverFind.walletBalance - result.amount) + 5)
      });
      await this.routebsRepository.update(routeId,
        { resheduledSits: newlist, bookedSits });
      // await this.routebsRepository.update(newrouteId,  
      //   {resheduledSits, bookedSits});
      await this.ticketbsRepository.update(id, { status: "CANCELED" })
      return { status: true };
    }
    else {
      return { message: "Insufficient funds" }
    }
  }





  async update(ticketbsDTO: TicketDTO, updater?: string): Promise<TicketDTO | undefined> {
    const ticketFind = await this.findByFields({ where: { id: ticketbsDTO.id, userId: ticketbsDTO.userId } });
    if (!ticketFind) return ticketFind;
    ticketbsDTO.status = ticketbsDTO.status ?? ticketFind.status
    // ticketbsDTO.issuedDate = new Date(ticketbsDTO.issuedDate).t ?? ticketFind.issuedDate
    ticketbsDTO.user = ticketFind.user
    ticketbsDTO.userId = ticketFind.userId
    ticketbsDTO.driver = ticketFind.driver
    ticketbsDTO.driverId = ticketFind.driverId
    ticketbsDTO.route = ticketFind.route
    // routebsDTO.bookedSits = routeFind.bookedSits.concat([(Number(routeFind.nextAvailableSeat))])
    ticketbsDTO.routeId = ticketFind.routeId
    ticketbsDTO.points = ticketFind.points
    ticketbsDTO.id = ticketFind.id
    ticketbsDTO.ticketNumber = ticketFind.ticketNumber
    ticketbsDTO.seatNumber = ticketbsDTO.seatNumber ?? ticketFind.seatNumber
    ticketbsDTO.amount = ticketbsDTO.amount ?? ticketFind.amount

    const entity = TicketMapper.fromDTOtoEntity(ticketbsDTO);
    if (updater) {
      entity.lastModifiedBy = updater;
    }
    // const result = await this.ticketbsRepository.update(entity);
    const result = await this.ticketbsRepository.save(entity);
    return TicketMapper.fromEntityToDTO(result);
  }

  async deleteById(id: number, userId: number)
  // : Promise<void | undefined> 
  {
    await this.ticketbsRepository.delete(id);
    const entityFind = await this.findById(id);
    if (entityFind) {
      throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
    }
    return true;
  }

}
