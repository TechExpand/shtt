/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { PassengerDTO } from './passenger.dto';
import { DriverDTO } from './driver.dto';


/**
 * A ReviewDTO object.
 */
export class ReviewDTO extends BaseDTO {

            
            @ApiProperty({description: 'content field'})
        content: any;

            @IsNotEmpty()
    @Min(1)
    @Max(5)
            @ApiProperty({description: 'rating field'})
        rating: number;


        @ApiProperty({ type: () => PassengerDTO,description: 'passenger relationship'})
        passenger: PassengerDTO;

        @ApiProperty({ type: () => DriverDTO,description: 'driver relationship'})
        driver: DriverDTO;

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
