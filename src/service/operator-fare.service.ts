import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { OperatorFareDTO }  from '../service/dto/operator-fare.dto';
import { OperatorFareMapper }  from '../service/mapper/operator-fare.mapper';
import { OperatorFareRepository } from '../repository/operator-fare.repository';

const relationshipNames = [];
    relationshipNames.push('route');
    relationshipNames.push('shuttleOperator');


@Injectable()
export class OperatorFareService {
    logger = new Logger('OperatorFareService');

    constructor(@InjectRepository(OperatorFareRepository) private operatorFarebsRepository: OperatorFareRepository) {}

      async findById(id: number): Promise<OperatorFareDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.operatorFarebsRepository.findOne( {where: { id }, ...options});
        return OperatorFareMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<OperatorFareDTO>): Promise<OperatorFareDTO | undefined> {
        const result = await this.operatorFarebsRepository.findOne(options);
        return OperatorFareMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<OperatorFareDTO>): Promise<[OperatorFareDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.operatorFarebsRepository.findAndCount(options);
        const operatorFarebsDTO: OperatorFareDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(operatorFarebs => operatorFarebsDTO.push(OperatorFareMapper.fromEntityToDTO(operatorFarebs)));
            resultList[0] = operatorFarebsDTO;
        }
        return resultList;
      }

      async save(operatorFarebsDTO: OperatorFareDTO, creator?: string): Promise<OperatorFareDTO | undefined> {
        const entity = OperatorFareMapper.fromDTOtoEntity(operatorFarebsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.operatorFarebsRepository.save(entity);
        return OperatorFareMapper.fromEntityToDTO(result);
      }

      async update(operatorFarebsDTO: OperatorFareDTO, updater?: string): Promise<OperatorFareDTO | undefined> {
        const entity = OperatorFareMapper.fromDTOtoEntity(operatorFarebsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.operatorFarebsRepository.save(entity);
        return OperatorFareMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.operatorFarebsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
