import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { SeatDTO }  from '../service/dto/seat.dto';
import { SeatMapper }  from '../service/mapper/seat.mapper';
import { SeatRepository } from '../repository/seat.repository';

const relationshipNames = [];
    relationshipNames.push('shuttle');


@Injectable()
export class SeatService {
    logger = new Logger('SeatService');

    constructor(@InjectRepository(SeatRepository) private seatbsRepository: SeatRepository) {}

      async findById(id: number): Promise<SeatDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.seatbsRepository.findOne( {where: { id }, ...options});
        return SeatMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<SeatDTO>): Promise<SeatDTO | undefined> {
        const result = await this.seatbsRepository.findOne(options);
        return SeatMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<SeatDTO>): Promise<[SeatDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.seatbsRepository.findAndCount(options);
        const seatbsDTO: SeatDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(seatbs => seatbsDTO.push(SeatMapper.fromEntityToDTO(seatbs)));
            resultList[0] = seatbsDTO;
        }
        return resultList;
      }



      async find(options: FindManyOptions<SeatDTO>)
      : Promise<SeatDTO[]> 
      {
        options.relations = [];
        let resultList = await this.seatbsRepository.find(options);
        const seatbsDTO: SeatDTO[] = [];
        if (resultList && resultList[0]) {
            resultList.forEach(seatbs => seatbsDTO.push(SeatMapper.fromEntityToDTO(seatbs)));
            resultList = seatbsDTO;
        }
        return seatbsDTO;
      }

      async save(seatbsDTO: SeatDTO, creator?: string): Promise<SeatDTO | undefined> {
        const entity = SeatMapper.fromDTOtoEntity(seatbsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.seatbsRepository.save(entity);
        return SeatMapper.fromEntityToDTO(result);
      }

      async update(seatbsDTO: SeatDTO, updater?: string): Promise<SeatDTO | undefined> {
        const entity = SeatMapper.fromDTOtoEntity(seatbsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.seatbsRepository.save(entity);
        return SeatMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.seatbsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
