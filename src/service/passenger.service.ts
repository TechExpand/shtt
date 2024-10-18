import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PassengerDTO }  from '../service/dto/passenger.dto';
import { PassengerMapper }  from '../service/mapper/passenger.mapper';
import { PassengerRepository } from '../repository/passenger.repository';

const relationshipNames = [];


@Injectable()
export class PassengerService {
    logger = new Logger('PassengerService');

    constructor(@InjectRepository(PassengerRepository) private passengerbsRepository: PassengerRepository) {}

      async findById(id: number): Promise<PassengerDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.passengerbsRepository.findOne( {where: { id }, ...options});
        return PassengerMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<PassengerDTO>): Promise<PassengerDTO | undefined> {
        const result = await this.passengerbsRepository.findOne(options);
        return PassengerMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<PassengerDTO>): Promise<[PassengerDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.passengerbsRepository.findAndCount(options);
        const passengerbsDTO: PassengerDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(passengerbs => passengerbsDTO.push(PassengerMapper.fromEntityToDTO(passengerbs)));
            resultList[0] = passengerbsDTO;
        }
        return resultList;
      }

      async save(passengerbsDTO: PassengerDTO, creator?: string): Promise<PassengerDTO | undefined> {
        const entity = PassengerMapper.fromDTOtoEntity(passengerbsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.passengerbsRepository.save(entity);
        return PassengerMapper.fromEntityToDTO(result);
      }

      async update(passengerbsDTO: PassengerDTO, updater?: string): Promise<PassengerDTO | undefined> {
        const entity = PassengerMapper.fromDTOtoEntity(passengerbsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.passengerbsRepository.save(entity);
        return PassengerMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.passengerbsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
