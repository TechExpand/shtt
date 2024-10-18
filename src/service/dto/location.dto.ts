/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { DriverDTO } from './driver.dto';
import { SeatDTO } from './seat.dto';
import { ShuttleOperatorDTO } from './shuttle-operator.dto';
import { PassengerDTO } from './passenger.dto';
import { UserDTO } from './user.dto';


/**
 * A ShuttleDTO object.
 */
export class LocationDTO extends BaseDTO {

        //     @IsNotEmpty()
        //     @ApiProperty({description: 'name field'})
        // name: string;

            @IsNotEmpty()
            @ApiProperty({description: 'capacity field'})
            latitude: number;

        //     @ApiProperty({description: 'model field', required: false})
        // model: string;

            @ApiProperty({description: 'manufacturingYear field', required: false})
            longitude: number;


            @ApiProperty({description: 'manufacturingYear field', required: false})
            userId?: number;

            @ApiProperty({ type: () => UserDTO,description: 'shuttle role'})
            user?: UserDTO;

      
        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
