/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { PassengerDTO } from './passenger.dto';


/**
 * A ComplaintDTO object.
 */
export class ComplaintDTO extends BaseDTO {

            @IsNotEmpty()
            @ApiProperty({description: 'date field'})
        date: any;

            @IsNotEmpty()
            @ApiProperty({description: 'description field'})
        description: string;

            @IsNotEmpty()
            @ApiProperty({description: 'status field'})
        status: string;


        @ApiProperty({ type: () => PassengerDTO,description: 'passenger relationship'})
        passenger: PassengerDTO;

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
