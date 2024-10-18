import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { DynamicFareDTO }  from '../service/dto/dynamic-fare.dto';
import { DynamicFareMapper }  from '../service/mapper/dynamic-fare.mapper';
import { DynamicFareRepository } from '../repository/dynamic-fare.repository';

const relationshipNames = [];
    relationshipNames.push('route');


@Injectable()
export class DynamicFareService {
    logger = new Logger('DynamicFareService');

    constructor(@InjectRepository(DynamicFareRepository) private dynamicFarebsRepository: DynamicFareRepository) {}

      async findById(id: number): Promise<DynamicFareDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.dynamicFarebsRepository.findOne( {where: { id }, ...options});
        return DynamicFareMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<DynamicFareDTO>): Promise<DynamicFareDTO | undefined> {
        const result = await this.dynamicFarebsRepository.findOne(options);
        return DynamicFareMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<DynamicFareDTO>): Promise<[DynamicFareDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.dynamicFarebsRepository.findAndCount(options);
        const dynamicFarebsDTO: DynamicFareDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(dynamicFarebs => dynamicFarebsDTO.push(DynamicFareMapper.fromEntityToDTO(dynamicFarebs)));
            resultList[0] = dynamicFarebsDTO;
        }
        return resultList;
      }

      async save(dynamicFarebsDTO: DynamicFareDTO, creator?: string): Promise<DynamicFareDTO | undefined> {
        const entity = DynamicFareMapper.fromDTOtoEntity(dynamicFarebsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.dynamicFarebsRepository.save(entity);
        return DynamicFareMapper.fromEntityToDTO(result);
      }

      async update(dynamicFarebsDTO: DynamicFareDTO, updater?: string): Promise<DynamicFareDTO | undefined> {
        const entity = DynamicFareMapper.fromDTOtoEntity(dynamicFarebsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.dynamicFarebsRepository.save(entity);
        return DynamicFareMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.dynamicFarebsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
