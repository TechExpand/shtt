// import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { FindManyOptions, FindOneOptions } from 'typeorm';
// import { RoutePointDTO }  from '../service/dto/route-stop.dto';
// import { RoutePointMapper }  from '../service/mapper/route-stop.mapper';
// import { RoutePointRepositorys } from '../repository/route-stop.repository';

// const relationshipNames = [];
//     relationshipNames.push('route');
//     relationshipNames.push('stop');


// @Injectable()
// export class RoutePointService {
//     logger = new Logger('RoutePointService');

//     constructor(@InjectRepository(RoutePointRepositorys) private routePointbsRepository: RoutePointRepositorys) {}

//       async findById(id: number): Promise<RoutePointDTO | undefined> {
//         const options = { relations: relationshipNames };
//         const result = await this.routePointbsRepository.findOne( {where: { id }, ...options});
//         return RoutePointMapper.fromEntityToDTO(result);
//       }

//       async findByFields(options: FindOneOptions<RoutePointDTO>): Promise<RoutePointDTO | undefined> {
//         const result = await this.routePointbsRepository.findOne(options);
//         return RoutePointMapper.fromEntityToDTO(result);
//       }

//       async findAndCount(options: FindManyOptions<RoutePointDTO>): Promise<[RoutePointDTO[], number]> {
//         options.relations = relationshipNames;
//         const resultList = await this.routePointbsRepository.findAndCount(options);
//         const routePointbsDTO: RoutePointDTO[] = [];
//         if (resultList && resultList[0]) {
//             resultList[0].forEach(routePointbs => routePointbsDTO.push(RoutePointMapper.fromEntityToDTO(routePointbs)));
//             resultList[0] = routePointbsDTO;
//         }
//         return resultList;
//       }

//       async save(routePointbsDTO: RoutePointDTO, creator?: string): Promise<RoutePointDTO | undefined> {
//         const entity = RoutePointMapper.fromDTOtoEntity(routePointbsDTO);
//         if (creator) {
//             if (!entity.createdBy) {
//                 entity.createdBy = creator;
//             }
//             entity.lastModifiedBy = creator;
//         }
//         const result = await this.routePointbsRepository.save(entity);
//         return RoutePointMapper.fromEntityToDTO(result);
//       }

//       async update(routePointbsDTO: RoutePointDTO, updater?: string): Promise<RoutePointDTO | undefined> {
//         const entity = RoutePointMapper.fromDTOtoEntity(routePointbsDTO);
//         if (updater) {
//             entity.lastModifiedBy = updater;
//         }
//         const result = await this.routePointbsRepository.save(entity);
//         return RoutePointMapper.fromEntityToDTO(result);
//       }

//       async deleteById(id: number): Promise<void | undefined> {
//         await this.routePointbsRepository.delete(id);
//         const entityFind = await this.findById(id);
//         if (entityFind) {
//           throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
//         }
//         return;
//       }

// }
