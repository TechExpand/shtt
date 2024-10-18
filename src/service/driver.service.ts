import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { DriverDTO }  from '../service/dto/driver.dto';
import { DriverMapper }  from '../service/mapper/driver.mapper';
import { DriverRepository } from '../repository/driver.repository';

const relationshipNames = [];


@Injectable()
export class DriverService {
    logger = new Logger('DriverService');

    constructor(@InjectRepository(DriverRepository) private driverbsRepository: DriverRepository) {}

      async findById(id: number): Promise<DriverDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.driverbsRepository.findOne( {where: { id }, ...options});
        return DriverMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<DriverDTO>): Promise<DriverDTO | undefined> {
        const result = await this.driverbsRepository.findOne(options);
        return DriverMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<DriverDTO>): Promise<[DriverDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.driverbsRepository.findAndCount(options);
        const driverbsDTO: DriverDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(driverbs => driverbsDTO.push(DriverMapper.fromEntityToDTO(driverbs)));
            resultList[0] = driverbsDTO;
        }
        return resultList;
      }

      async save(driverbsDTO: DriverDTO, creator?: string): Promise<DriverDTO | undefined> {
        const entity = DriverMapper.fromDTOtoEntity(driverbsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.driverbsRepository.save(entity);
        return DriverMapper.fromEntityToDTO(result);
      }

      async update(driverbsDTO: DriverDTO, updater?: string): Promise<DriverDTO | undefined> {
        const entity = DriverMapper.fromDTOtoEntity(driverbsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.driverbsRepository.save(entity);
        return DriverMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.driverbsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
