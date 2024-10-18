import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { PaymentDTO }  from '../service/dto/payment.dto';
import { PaymentMapper }  from '../service/mapper/payment.mapper';
import { PaymentRepository } from '../repository/payment.repository';

const relationshipNames = [];


@Injectable()
export class PaymentService {
    logger = new Logger('PaymentService');

    constructor(@InjectRepository(PaymentRepository) private paymentbsRepository: PaymentRepository) {}

      async findById(id: number): Promise<PaymentDTO | undefined> {
        const options = { relations: relationshipNames };
        const result = await this.paymentbsRepository.findOne( {where: { id }, ...options});
        return PaymentMapper.fromEntityToDTO(result);
      }

      async findByFields(options: FindOneOptions<PaymentDTO>): Promise<PaymentDTO | undefined> {
        const result = await this.paymentbsRepository.findOne(options);
        return PaymentMapper.fromEntityToDTO(result);
      }

      async findAndCount(options: FindManyOptions<PaymentDTO>): Promise<[PaymentDTO[], number]> {
        options.relations = relationshipNames;
        const resultList = await this.paymentbsRepository.findAndCount(options);
        const paymentbsDTO: PaymentDTO[] = [];
        if (resultList && resultList[0]) {
            resultList[0].forEach(paymentbs => paymentbsDTO.push(PaymentMapper.fromEntityToDTO(paymentbs)));
            resultList[0] = paymentbsDTO;
        }
        return resultList;
      }

      async save(paymentbsDTO: PaymentDTO, creator?: string): Promise<PaymentDTO | undefined> {
        const entity = PaymentMapper.fromDTOtoEntity(paymentbsDTO);
        if (creator) {
            if (!entity.createdBy) {
                entity.createdBy = creator;
            }
            entity.lastModifiedBy = creator;
        }
        const result = await this.paymentbsRepository.save(entity);
        return PaymentMapper.fromEntityToDTO(result);
      }

      async update(paymentbsDTO: PaymentDTO, updater?: string): Promise<PaymentDTO | undefined> {
        const entity = PaymentMapper.fromDTOtoEntity(paymentbsDTO);
        if (updater) {
            entity.lastModifiedBy = updater;
        }
        const result = await this.paymentbsRepository.save(entity);
        return PaymentMapper.fromEntityToDTO(result);
      }

      async deleteById(id: number): Promise<void | undefined> {
        await this.paymentbsRepository.delete(id);
        const entityFind = await this.findById(id);
        if (entityFind) {
          throw new HttpException('Error, entity not deleted!', HttpStatus.NOT_FOUND);
        }
        return;
      }

}
