import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ShuttleDTO }  from '../service/dto/shuttle.dto';
import { ShuttleMapper }  from '../service/mapper/shuttle.mapper';
import { ShuttleRepository } from '../repository/shuttle.repository';

const relationshipNames = [];
    relationshipNames.push('shuttleOperator');
    relationshipNames.push('passengers');


@Injectable()
export class ShuttleService {
    logger = new Logger('ShuttleService');

    constructor(@InjectRepository(ShuttleRepository) private shuttlebsRepository: ShuttleRepository) {}

      async findById(id: number): Promise<ShuttleDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.shuttlebsRepository.findOne( {where: { id }, ...options});
        return ShuttleMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<ShuttleDTO>): Promise<ShuttleDTO | undefined> {
        const result = await this.shuttlebsRepository.findOne(options);
        return ShuttleMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<ShuttleDTO>): Promise<[ShuttleDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.shuttlebsRepository.findAndCount(options);
        const shuttlebsDTO: ShuttleDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(shuttlebs => shuttlebsDTO.push(ShuttleMapper.fromEntityToDTO(shuttlebs)));
            resultList[0] = shuttlebsDTO;
        }
        return resultList;
      }

      async save(shuttlebsDTO: ShuttleDTO, creator?: string): Promise<ShuttleDTO | undefined> {
        const entity = ShuttleMapper.fromDTOtoEntity(shuttlebsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.shuttlebsRepository.save(entity);
        return ShuttleMapper.fromEntityToDTO(result);
      }

      async update(shuttlebsDTO: ShuttleDTO, updater?: string): Promise<ShuttleDTO | undefined> {
        const entity = ShuttleMapper.fromDTOtoEntity(shuttlebsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.shuttlebsRepository.save(entity);
        return ShuttleMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.shuttlebsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
