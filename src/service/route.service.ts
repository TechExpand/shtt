import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Like } from 'typeorm';
import { RouteDTO }  from '../service/dto/route.dto';
import { RouteMapper }  from '../service/mapper/route.mapper';
import { RouteRepositorys } from '../repository/route.repository';
import { UserService } from './user.service';
import { PointService } from './point.service';
import { PointRepositorys } from 'src/repository/point.repository';
import { Pointbs } from 'src/domain/point.entity';
import { PointDTO } from './dto/point.dto';
const axios = require("axios")
import { PointMapper } from './mapper/point.mapper';
import { removeDuplicateObjects } from 'src/utils/sms';
import { User } from 'src/domain/user.entity';
import { Routebs } from 'src/domain/route.entity';
import { TicketRepository } from 'src/repository/ticket.repository';
import { TicketMapper } from './mapper/ticket.mapper';
import { TicketDTO } from './dto/ticket.dto';
import { getDistanceFromLatLonInKm } from 'src/utils/calculateDistance';

const relationshipNames = [];


@Injectable()
export class RouteService {
    logger = new Logger('RouteService');

    constructor(@Inject(RouteRepositorys) 
     private readonly routebsRepository: RouteRepositorys,
     private readonly pointbsRepository: PointRepositorys,
     private readonly ticketbsRepository: TicketRepository,
     private readonly pointService: PointService,
     private readonly userService: UserService
     ) {}


    // constructor(
    //   @Inject(UserRepository)
    //   private readonly userRepository: UserRepository,
    //   @Inject(VerifyRepository)
    //   private readonly verifyRepository: VerifyRepository,
    // ) {}

      async findById(id: number): Promise<RouteDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.routebsRepository.findOne( {where: { id }, ...options});
        const points = await this.pointbsRepository.find( {where: { routeId: result.id }});
        result.points = points;
        return RouteMapper.fromEntityToDTO(result);
      }





      // async getUserRoutes(id: number): Promise<RouteDTO[] | undefined> {
      //   // const options = { relations: relationshipNames };
      //   // const result = await this.routebsRepository.findOne( {where: { id }, ...options});
      //   const tickets = await this.ticketbsRepository.find( {where: { id: result.id }});
      //   // result.points = points;
      //   return TicketMapper.fromEntityToDTO(tickets);
      // }



      async getUserRoutes(id: number): Promise<[TicketDTO[], number] | any> {
        // options.relations = relationshipNames;
        const resultList = await this.ticketbsRepository.findAndCount( {where: {routeId: id }, relations: ["user", "driver", "route"]});
        const ticketDTO: TicketDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(ticketbs => ticketDTO.push(TicketMapper.fromEntityToDTO(ticketbs)));
            resultList[0] = ticketDTO;
        }
        return resultList[0];
      }



      async updateRoute(id: number, status:string): Promise< any> {
        // options.relations = relationshipNames;
        const result = await this.routebsRepository.findOne({where:{id}});
        if(!result) return false;
        await this.routebsRepository.update(id,  {status });
        return true;
      }




      async findByFields(options: FindOneOptions<RouteDTO>): Promise<RouteDTO | undefined> {
        const result = await this.routebsRepository.findOne(options);
        return RouteMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<RouteDTO>): Promise<[RouteDTO[], number] | any> {
        options.relations = ["user", "points"];
        const resultList = await this.routebsRepository.findAndCount(options);
        const routebsDTO: RouteDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(routebs => routebsDTO.push(RouteMapper.fromEntityToDTO(routebs)));
            resultList[0] = routebsDTO;
        }
        return resultList;
        // return []
      }




      // async findAndCountAvailableDrivers(options: FindManyOptions<RouteDTO>): Promise<[RouteDTO[], number] | any> {
      //   // options.relations = relationshipNames;
      //   const resultList = await this.routebsRepository.findAndCount({where:{}});
      //   const routebsDTO: RouteDTO[] = [];
      //   if (resultList && resultList[0]) {
      //       resultList[0].forEach(routebs => routebsDTO.push(RouteMapper.fromEntityToDTO(routebs)));
      //       resultList[0] = routebsDTO;
      //   }
      //   return resultList;
      //   // return []
      // }


      async getDistance(origin:String, destination:String): Promise<Number>{
        const response = await axios({
          url: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&units=metric&key=AIzaSyAXyfHKsb7l7fzUj_WuZa-vsK-4o8mBRT0`,
          method: "get",
        });
    
        let distance = 0;
    
        for(var value of response.data.rows[0].elements){
          distance = distance +  (Number(value.distance.value)/1000)
          console.log(distance)
        }
        
        
        const distanceMiles =  Number(distance * 0.621)
        return distanceMiles;
      }


      async findAndCountAvailableDriversSearch(location: string): Promise<RouteDTO[]> {
        console.log(location)
        const allRoutes = await this.routebsRepository.find({ relations: ['user'] ,
        where: [
          { dropoffLocation: Like(`%${location}%`) },
          { pickupLocation: Like(`%${location}%`) },
          // { type: Like(`%${location}%`) },
        ],
      });
      
      const uniqueUserIds = new Set<number>();
      const filteredRoutes: RouteDTO[] = [];

      allRoutes.forEach((routes) => {
        if (!uniqueUserIds.has(routes.user.id)) {
          uniqueUserIds.add(routes.user.id);
          filteredRoutes.push(routes);
        }
      });
        
        return filteredRoutes;
      }


  

      async findAndCountAvailableDriversLocation(pickupLan: number, pickupLog: number, dropoffLan: number, dropoffLog: number): Promise<RouteDTO[]> {
        const radiusInKm = 1000; // Define the radius within which you want to fetch locations
        // dropoffLog, dropoffLan, pickupLog, pickupLan
        let routes:any = [];
        let routes2:any = [];
        const getRoutes = await this.routebsRepository.find({ relations: ['user', 'points'],
        
      });
				for(let value of getRoutes){
				   const lan1 =  value.pickupLan
				   const log1 =  value.pickupLog
					const distance =  getDistanceFromLatLonInKm(
						Number(lan1), Number(log1), Number(pickupLan),  Number(pickupLog)
					);
          console.log(`1 ${distance}`)
					if(distance <= 500){
						routes.push(value)
					}
				}
        for(let value of getRoutes){
					
				   const lan1 =  value.dropoffLan
				   const log1 =  value.dropoffLog
					const distance =  getDistanceFromLatLonInKm(
						Number(lan1), Number(log1), Number(dropoffLan),  Number(dropoffLog)
					);
          console.log(`2 ${distance}`)
					if(distance <= 500){
						routes2.push(value)
					}
				}
        return removeDuplicateObjects(routes.concat(routes2));
        // return null;
      }




      async save(routebsDTO: RouteDTO, creator?: string): Promise<RouteDTO | undefined> {
        const entity = RouteMapper.fromDTOtoEntity(routebsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        console.log(routebsDTO)
        const userFind = await this.userService.findByFields({where: {id: routebsDTO.userId}});
        routebsDTO.user = userFind
        routebsDTO.pickupLan = Number(routebsDTO.pickupLan)
        routebsDTO.pickupLog = Number(routebsDTO.pickupLog)
        routebsDTO.dropoffLan = Number(routebsDTO.dropoffLan)
        routebsDTO.dropoffLog = Number(routebsDTO.dropoffLog)
        routebsDTO.price = Number(routebsDTO.price)
        routebsDTO.maximumSeat = Number(routebsDTO.maximumSeat)
        routebsDTO.distance = Number(routebsDTO.distance)
       
        const result = await this.routebsRepository.save(entity);
        let point_entity = []
        let  new_routebsDTO = routebsDTO.points;
        // JSON.parse(JSON.stringify(routebsDTO.points))
        // let  new_new_routebsDTO = JSON.parse(JSON.stringify(new_routebsDTO))
        // let new_routebsDTO = eval('(' + routebsDTO.points + ')');
        // console.log(typeof new_routebsDTO)
  
        for(let i = 0; i< new_routebsDTO.length; i++){
          let pointbsDTO = new PointDTO()
     
          pointbsDTO.address = new_routebsDTO[i].address
          pointbsDTO.latitude = Number(new_routebsDTO[i].latitude)
          pointbsDTO.longitude = Number(new_routebsDTO[i].longitude)
          pointbsDTO.type = new_routebsDTO[i].type
          pointbsDTO.routeId =  Number(result.id);
          const entity = PointMapper.fromDTOtoEntity(pointbsDTO);
          point_entity.push(entity)
        }
       
        const point_result = await this.pointbsRepository.save(point_entity);
        const routeFind = await this.findByFields({ where: { id: result.id} });
        routebsDTO.points = point_result
        routebsDTO.distance = routebsDTO.distance?? routeFind.distance
        routebsDTO.dropoffLan = routebsDTO.dropoffLan ?? routeFind.dropoffLan
        routebsDTO.dropoffLog = routebsDTO.dropoffLog ?? routeFind.dropoffLog
        routebsDTO.maximumSeat =  routebsDTO.maximumSeat ?? routeFind.maximumSeat
        routebsDTO.pickupLan = routebsDTO.pickupLan?? routeFind.pickupLan
        routebsDTO.pickupLog = routebsDTO.pickupLog?? routeFind.pickupLog
        routebsDTO.userId =routebsDTO.userId?? routeFind.userId
        routebsDTO.id = routeFind.id
        routebsDTO.user = userFind
        routebsDTO.pickupLocation = routebsDTO.pickupLocation?? routeFind.pickupLocation
        routebsDTO.dropoffLocation = routebsDTO.dropoffLocation?? routeFind.dropoffLocation
        // routebsDTO.type = routebsDTO.type?? routeFind.type
       

        const entity_new = RouteMapper.fromDTOtoEntity(routebsDTO);
        const result_new = await this.routebsRepository.save(entity_new);
        return RouteMapper.fromEntityToDTO(result_new);
      }




      async update(routebsDTO: RouteDTO,  updater?: string): Promise<RouteDTO | undefined> {
        const entity = RouteMapper.fromDTOtoEntity(routebsDTO);
      
        if (updater) {
            entity.lastModifiedBy = updater;
        }

        const points = await this.pointbsRepository.find( {where: { routeId: routebsDTO.id }});
       
        points.forEach(async (e)=>{
           await this.pointbsRepository.delete(e.id);
        })
       
        
        let point_entity = []
        let  new_routebsDTO = routebsDTO.points;
     
        for(let i = 0; i< new_routebsDTO.length; i++){
          let pointbsDTO = new PointDTO()
     
          pointbsDTO.address = new_routebsDTO[i].address
          pointbsDTO.latitude = Number(new_routebsDTO[i].latitude)
          pointbsDTO.longitude = Number(new_routebsDTO[i].longitude)
          pointbsDTO.type = new_routebsDTO[i].type
          console.log(routebsDTO.id)
          pointbsDTO.routeId =  Number(routebsDTO.id);
          const entity = PointMapper.fromDTOtoEntity(pointbsDTO);
          point_entity.push(entity)
        }
       
        const point_result = await this.pointbsRepository.save(point_entity);
        const routeFind = await this.findByFields({ where: { id: routebsDTO.id } });
        routebsDTO.points = point_result
        routebsDTO.distance = routebsDTO.distance?? routeFind.distance
        routebsDTO.bookedSits = routeFind.bookedSits
        routebsDTO.dropoffLan = routebsDTO.dropoffLan ?? routeFind.dropoffLan
        routebsDTO.price = routebsDTO.price ?? routeFind.price
        routebsDTO.maximumSeat =  routebsDTO.maximumSeat ?? routeFind.maximumSeat
        routebsDTO.dropoffLog = routebsDTO.dropoffLog ?? routeFind.dropoffLog
        routebsDTO.pickupLan = routebsDTO.pickupLan?? routeFind.pickupLan
        routebsDTO.pickupLog = routebsDTO.pickupLog?? routeFind.pickupLog
        routebsDTO.userId =routebsDTO.userId?? routeFind.userId
        routebsDTO.id = routeFind.id
        routebsDTO.user = routeFind.user
        routebsDTO.pickupLocation = routebsDTO.pickupLocation?? routeFind.pickupLocation
        routebsDTO.dropoffLocation = routebsDTO.dropoffLocation?? routeFind.dropoffLocation
        // routebsDTO.type = routebsDTO.type?? routeFind.type

        const entity_new = RouteMapper.fromDTOtoEntity(routebsDTO);
        const result_new = await this.routebsRepository.save(entity_new);
        return RouteMapper.fromEntityToDTO(result_new);
      }



      // async update(routebsDTO: RouteDTO, updater?: string): Promise<RouteDTO | undefined> {
      //   const routeFind = await this.findByFields({ where: { id: routebsDTO.id, userId: routebsDTO.userId}, relations:['user'] });
      //   if(!routeFind) return routeFind;
      //   routebsDTO.distance = routebsDTO.distance?? routeFind.distance
      //   routebsDTO.dropoffLan = routebsDTO.dropoffLan ?? routeFind.dropoffLan
      //   routebsDTO.dropoffLog = routebsDTO.dropoffLog ?? routeFind.dropoffLog
      //   routebsDTO.pickupLan = routebsDTO.pickupLan?? routeFind.pickupLan
      //   routebsDTO.pickupLog = routebsDTO.pickupLog?? routeFind.pickupLog
      //   routebsDTO.userId =routebsDTO.userId?? routeFind.userId
      //   routebsDTO.id = routeFind.id
      //   routebsDTO.user = routeFind.user
      //   routebsDTO.pickupLocation = routebsDTO.pickupLocation?? routeFind.pickupLocation
      //   routebsDTO.dropoffLocation = routebsDTO.dropoffLocation?? routeFind.dropoffLocation
      //   // routebsDTO.type = routebsDTO.type?? routeFind.type

      //   const entity = RouteMapper.fromDTOtoEntity(routebsDTO);
      //   if (updater) {
      //       entity.lastModifiedBy = updater;
      //   }
      //   const result = await this.routebsRepository.save(entity);
      //   return RouteMapper.fromEntityToDTO(result);
      // }






      async deleteById(id: number): Promise<any | undefined> {
        await this.routebsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return {message: "item removed"};
      }

}
