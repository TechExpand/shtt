import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { ReviewDTO }  from '../service/dto/review.dto';
import { ReviewMapper }  from '../service/mapper/review.mapper';
import { ReviewRepository } from '../repository/review.repository';

const relationshipNames = [];


@Injectable()
export class ReviewService {
    logger = new Logger('ReviewService');

    constructor(@InjectRepository(ReviewRepository) private reviewbsRepository: ReviewRepository) {}

      async findById(id: number): Promise<ReviewDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.reviewbsRepository.findOne( {where: { id }, ...options});
        return ReviewMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<ReviewDTO>): Promise<ReviewDTO | undefined> {
        const result = await this.reviewbsRepository.findOne(options);
        return ReviewMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<ReviewDTO>): Promise<[ReviewDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.reviewbsRepository.findAndCount(options);
        const reviewbsDTO: ReviewDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(reviewbs => reviewbsDTO.push(ReviewMapper.fromEntityToDTO(reviewbs)));
            resultList[0] = reviewbsDTO;
        }
        return resultList;
      }

      async save(reviewbsDTO: ReviewDTO, creator?: string): Promise<ReviewDTO | undefined> {
        const entity = ReviewMapper.fromDTOtoEntity(reviewbsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.reviewbsRepository.save(entity);
        return ReviewMapper.fromEntityToDTO(result);
      }

      async update(reviewbsDTO: ReviewDTO, updater?: string): Promise<ReviewDTO | undefined> {
        const entity = ReviewMapper.fromDTOtoEntity(reviewbsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.reviewbsRepository.save(entity);
        return ReviewMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.reviewbsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
