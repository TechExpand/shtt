import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { CheckInDTO }  from '../service/dto/check-in.dto';
import { CheckInMapper }  from '../service/mapper/check-in.mapper';
import { CheckInRepository } from '../repository/check-in.repository';

const relationshipNames = [];
    relationshipNames.push('driver');
    relationshipNames.push('schedule');


@Injectable()
export class CheckInService {
    logger = new Logger('CheckInService');

    constructor(@InjectRepository(CheckInRepository) private checkInbsRepository: CheckInRepository) {}

      async findById(id: number): Promise<CheckInDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.checkInbsRepository.findOne( {where: { id }, ...options});
        return CheckInMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<CheckInDTO>): Promise<CheckInDTO | undefined> {
        const result = await this.checkInbsRepository.findOne(options);
        return CheckInMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<CheckInDTO>): Promise<[CheckInDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.checkInbsRepository.findAndCount(options);
        const checkInbsDTO: CheckInDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(checkInbs => checkInbsDTO.push(CheckInMapper.fromEntityToDTO(checkInbs)));
            resultList[0] = checkInbsDTO;
        }
        return resultList;
      }

      async save(checkInbsDTO: CheckInDTO, creator?: string): Promise<CheckInDTO | undefined> {
        const entity = CheckInMapper.fromDTOtoEntity(checkInbsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.checkInbsRepository.save(entity);
        return CheckInMapper.fromEntityToDTO(result);
      }

      async update(checkInbsDTO: CheckInDTO, updater?: string): Promise<CheckInDTO | undefined> {
        const entity = CheckInMapper.fromDTOtoEntity(checkInbsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.checkInbsRepository.save(entity);
        return CheckInMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.checkInbsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
