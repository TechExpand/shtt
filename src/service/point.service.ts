import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PointDTO }  from './dto/point.dto';
import { PointMapper }  from './mapper/point.mapper';
import { PointRepositorys } from '../repository/point.repository';

const relationshipNames = [];


@Injectable()
export class PointService {
    logger = new Logger('PointService');

    constructor(@InjectRepository(PointRepositorys) private PointbsRepository: PointRepositorys) {}

      async findById(id: number): Promise<PointDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.PointbsRepository.findOne( {where: { id }, ...options});
        return PointMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<PointDTO>): Promise<PointDTO | undefined> {
        const result = await this.PointbsRepository.findOne(options);
        return PointMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<PointDTO>): Promise<[PointDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.PointbsRepository.findAndCount(options);
        const PointbsDTO: PointDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(Pointbs => PointbsDTO.push(PointMapper.fromEntityToDTO(Pointbs)));
            resultList[0] = PointbsDTO;
        }
        return resultList;
      }

      async save(PointbsDTO: PointDTO, creator?: string): Promise<PointDTO | undefined> {
        const entity = PointMapper.fromDTOtoEntity(PointbsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.PointbsRepository.save(entity);
        return PointMapper.fromEntityToDTO(result);
      }

      async update(PointbsDTO: PointDTO, updater?: string): Promise<PointDTO | undefined> {
        const entity = PointMapper.fromDTOtoEntity(PointbsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.PointbsRepository.save(entity);
        return PointMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.PointbsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
