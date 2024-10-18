import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { RoleRepository } from 'src/repository/role.repository';
import { RoleDTO } from './dto/role.dto';
import { RoleMapper } from './mapper/role.mapper';

const relationshipNames = [];
    relationshipNames.push('shuttle');


@Injectable()
export class RoleService {
    logger = new Logger('RoleService');

    constructor(@InjectRepository(RoleRepository) private rolebsRepository: RoleRepository) {}

      async findById(id: number): Promise<RoleDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.rolebsRepository.findOne( {where: { id }, ...options});
        return RoleMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<RoleDTO>): Promise<RoleDTO | undefined> {
        const result = await this.rolebsRepository.findOne(options);
        return RoleMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<RoleDTO>): Promise<[RoleDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.rolebsRepository.findAndCount(options);
        const seatbsDTO: RoleDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(seatbs => seatbsDTO.push(RoleMapper.fromEntityToDTO(seatbs)));
            resultList[0] = seatbsDTO;
        }
        return resultList;
      }

      async save(seatbsDTO: RoleDTO, creator?: string): Promise<RoleDTO | undefined> {
        const entity = RoleMapper.fromDTOtoEntity(seatbsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.rolebsRepository.save(entity);
        return RoleMapper.fromEntityToDTO(result);
      }

      async update(seatbsDTO: RoleDTO, updater?: string): Promise<RoleDTO | undefined> {
        const entity = RoleMapper.fromDTOtoEntity(seatbsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.rolebsRepository.save(entity);
        return RoleMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.rolebsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
