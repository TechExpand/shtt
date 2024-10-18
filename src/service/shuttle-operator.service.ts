import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ShuttleOperatorDTO }  from '../service/dto/shuttle-operator.dto';
import { ShuttleOperatorMapper }  from '../service/mapper/shuttle-operator.mapper';
import { ShuttleOperatorRepository } from '../repository/shuttle-operator.repository';

const relationshipNames = [];


@Injectable()
export class ShuttleOperatorService {
    logger = new Logger('ShuttleOperatorService');

    constructor(@InjectRepository(ShuttleOperatorRepository) private shuttleOperatorbsRepository: ShuttleOperatorRepository) {}

      async findById(id: number): Promise<ShuttleOperatorDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.shuttleOperatorbsRepository.findOne( {where: { id }, ...options});
        return ShuttleOperatorMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<ShuttleOperatorDTO>): Promise<ShuttleOperatorDTO | undefined> {
        const result = await this.shuttleOperatorbsRepository.findOne(options);
        return ShuttleOperatorMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<ShuttleOperatorDTO>): Promise<[ShuttleOperatorDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.shuttleOperatorbsRepository.findAndCount(options);
        const shuttleOperatorbsDTO: ShuttleOperatorDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(shuttleOperatorbs => shuttleOperatorbsDTO.push(ShuttleOperatorMapper.fromEntityToDTO(shuttleOperatorbs)));
            resultList[0] = shuttleOperatorbsDTO;
        }
        return resultList;
      }

      async save(shuttleOperatorbsDTO: ShuttleOperatorDTO, creator?: string): Promise<ShuttleOperatorDTO | undefined> {
        const entity = ShuttleOperatorMapper.fromDTOtoEntity(shuttleOperatorbsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.shuttleOperatorbsRepository.save(entity);
        return ShuttleOperatorMapper.fromEntityToDTO(result);
      }

      async update(shuttleOperatorbsDTO: ShuttleOperatorDTO, updater?: string): Promise<ShuttleOperatorDTO | undefined> {
        const entity = ShuttleOperatorMapper.fromDTOtoEntity(shuttleOperatorbsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.shuttleOperatorbsRepository.save(entity);
        return ShuttleOperatorMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.shuttleOperatorbsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
