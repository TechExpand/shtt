import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { OperatorLogDTO }  from '../service/dto/operator-log.dto';
import { OperatorLogMapper }  from '../service/mapper/operator-log.mapper';
import { OperatorLogRepository } from '../repository/operator-log.repository';

const relationshipNames = [];
    relationshipNames.push('shuttleOperator');


@Injectable()
export class OperatorLogService {
    logger = new Logger('OperatorLogService');

    constructor(@InjectRepository(OperatorLogRepository) private operatorLogbsRepository: OperatorLogRepository) {}

      async findById(id: number): Promise<OperatorLogDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.operatorLogbsRepository.findOne( {where: { id }, ...options});
        return OperatorLogMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<OperatorLogDTO>): Promise<OperatorLogDTO | undefined> {
        const result = await this.operatorLogbsRepository.findOne(options);
        return OperatorLogMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<OperatorLogDTO>): Promise<[OperatorLogDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.operatorLogbsRepository.findAndCount(options);
        const operatorLogbsDTO: OperatorLogDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(operatorLogbs => operatorLogbsDTO.push(OperatorLogMapper.fromEntityToDTO(operatorLogbs)));
            resultList[0] = operatorLogbsDTO;
        }
        return resultList;
      }

      async save(operatorLogbsDTO: OperatorLogDTO, creator?: string): Promise<OperatorLogDTO | undefined> {
        const entity = OperatorLogMapper.fromDTOtoEntity(operatorLogbsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.operatorLogbsRepository.save(entity);
        return OperatorLogMapper.fromEntityToDTO(result);
      }

      async update(operatorLogbsDTO: OperatorLogDTO, updater?: string): Promise<OperatorLogDTO | undefined> {
        const entity = OperatorLogMapper.fromDTOtoEntity(operatorLogbsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.operatorLogbsRepository.save(entity);
        return OperatorLogMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.operatorLogbsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
