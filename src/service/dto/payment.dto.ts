/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';




/**
 * A PaymentDTO object.
 */
export class PaymentDTO extends BaseDTO {

            @IsNotEmpty()
            @ApiProperty({description: 'amount field'})
        amount: number;

            @IsNotEmpty()
            @ApiProperty({description: 'paymentDate field'})
        paymentDate: any;


        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
