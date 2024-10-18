import { Injectable, HttpException, HttpStatus, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { SeatDTO }  from '../service/dto/seat.dto';
import { SeatMapper }  from '../service/mapper/seat.mapper';
import { SeatRepository } from '../repository/seat.repository';
import { LocationRepository } from 'src/repository/location.repository';
import { LocationDTO } from './dto/location.dto';
import { LocationMapper } from './mapper/location.mapper';
// import { LocationRepository } from 'src/repository/location.repository';


const relationshipNames = [];
    relationshipNames.push('user');


@Injectable()
export class LocationService {
    logger = new Logger('LocationService');
  
    constructor(
      @InjectRepository(LocationRepository)
      private readonly locationbsRepository: LocationRepository,
      // @Inject(VerifyRepository)
      // private readonly verifyRepository: VerifyRepository,
    ) {}

      async findById(id: number): Promise<LocationDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.locationbsRepository.findOne( {where: { id }, ...options});
        return LocationMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<LocationDTO>): Promise<LocationDTO | undefined> {
        const result = await this.locationbsRepository.findOne(options);
        return LocationMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<LocationDTO>)
    //   : 
    //   Promise<[LocationDTO[], number]>
       {
        options.relations = relationshipNames;
        const resultList = await this.locationbsRepository.findAndCount(options);
        const seatbsDTO: LocationDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(seatbs => seatbsDTO.push(LocationMapper.fromEntityToDTO(seatbs)));
            // resultList[0] = seatbsDTO;
        }
        return seatbsDTO;
      }



      async find(options: FindManyOptions<LocationDTO>)
      : Promise<LocationDTO[]> 
      {
        options.relations = [];
        let resultList = await this.locationbsRepository.find(options);
        const seatbsDTO: LocationDTO[] = [];
        if (resultList && resultList[0]) {
            resultList.forEach(seatbs => seatbsDTO.push(LocationMapper.fromEntityToDTO(seatbs)));
            // resultList = seatbsDTO;
        }
        return seatbsDTO;
      }

      async save(seatbsDTO: LocationDTO, creator?: string): Promise<LocationDTO | undefined> {
        const entity = LocationMapper.fromDTOtoEntity(seatbsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.locationbsRepository.save(entity);
        return LocationMapper.fromEntityToDTO(result);
      }

      async update(seatbsDTO: LocationDTO, updater?: string): Promise<LocationDTO | undefined> {
        const entity = LocationMapper.fromDTOtoEntity(seatbsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.locationbsRepository.save(entity);
        return LocationMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.locationbsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
