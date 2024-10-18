import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ScheduleDTO }  from '../service/dto/schedule.dto';
import { ScheduleMapper }  from '../service/mapper/schedule.mapper';
import { ScheduleRepository } from '../repository/schedule.repository';

const relationshipNames = [];
    relationshipNames.push('shuttle');
    relationshipNames.push('route');


@Injectable()
export class ScheduleService {
    logger = new Logger('ScheduleService');

    constructor(@InjectRepository(ScheduleRepository) private schedulebsRepository: ScheduleRepository) {}

      async findById(id: number): Promise<ScheduleDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.schedulebsRepository.findOne( {where: { id }, ...options});
        return ScheduleMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<ScheduleDTO>): Promise<ScheduleDTO | undefined> {
        const result = await this.schedulebsRepository.findOne(options);
        return ScheduleMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<ScheduleDTO>): Promise<[ScheduleDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.schedulebsRepository.findAndCount(options);
        const schedulebsDTO: ScheduleDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(schedulebs => schedulebsDTO.push(ScheduleMapper.fromEntityToDTO(schedulebs)));
            resultList[0] = schedulebsDTO;
        }
        return resultList;
      }

      async save(schedulebsDTO: ScheduleDTO, creator?: string): Promise<ScheduleDTO | undefined> {
        const entity = ScheduleMapper.fromDTOtoEntity(schedulebsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.schedulebsRepository.save(entity);
        return ScheduleMapper.fromEntityToDTO(result);
      }

      async update(schedulebsDTO: ScheduleDTO, updater?: string): Promise<ScheduleDTO | undefined> {
        const entity = ScheduleMapper.fromDTOtoEntity(schedulebsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.schedulebsRepository.save(entity);
        return ScheduleMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.schedulebsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
