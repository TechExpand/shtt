/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { ShuttleDTO } from './shuttle.dto';


/**
 * A PassengerDTO object.
 */
export class PassengerDTO extends BaseDTO {

            @IsNotEmpty()
            @ApiProperty({description: 'name field'})
        name: string;

            @IsNotEmpty()
            @ApiProperty({description: 'email field'})
        email: string;

            @ApiProperty({description: 'dateOfBirth field', required: false})
        dateOfBirth: any;

            @ApiProperty({description: 'phoneNumber field', required: false})
        phoneNumber: string;

            @ApiProperty({description: 'address field', required: false})
        address: string;


        @ApiProperty({ type: () => () => ShuttleDTO, isArray: true,description: 'shuttles relationship'})
        shuttles: ShuttleDTO[];

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
