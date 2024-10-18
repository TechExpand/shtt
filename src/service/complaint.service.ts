import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ComplaintDTO }  from '../service/dto/complaint.dto';
import { ComplaintMapper }  from '../service/mapper/complaint.mapper';
import { ComplaintRepository } from '../repository/complaint.repository';

const relationshipNames = [];
    relationshipNames.push('passenger');


@Injectable()
export class ComplaintService {
    logger = new Logger('ComplaintService');

    constructor(@InjectRepository(ComplaintRepository) private complaintbsRepository: ComplaintRepository) {}

      async findById(id: number): Promise<ComplaintDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.complaintbsRepository.findOne( {where: { id }, ...options});
        return ComplaintMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<ComplaintDTO>): Promise<ComplaintDTO | undefined> {
        const result = await this.complaintbsRepository.findOne(options);
        return ComplaintMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<ComplaintDTO>): Promise<[ComplaintDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.complaintbsRepository.findAndCount(options);
        const complaintbsDTO: ComplaintDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(complaintbs => complaintbsDTO.push(ComplaintMapper.fromEntityToDTO(complaintbs)));
            resultList[0] = complaintbsDTO;
        }
        return resultList;
      }

      async save(complaintbsDTO: ComplaintDTO, creator?: string): Promise<ComplaintDTO | undefined> {
        const entity = ComplaintMapper.fromDTOtoEntity(complaintbsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.complaintbsRepository.save(entity);
        return ComplaintMapper.fromEntityToDTO(result);
      }

      async update(complaintbsDTO: ComplaintDTO, updater?: string): Promise<ComplaintDTO | undefined> {
        const entity = ComplaintMapper.fromDTOtoEntity(complaintbsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.complaintbsRepository.save(entity);
        return ComplaintMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.complaintbsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
