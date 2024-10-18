/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { ShuttleDTO } from './shuttle.dto';
import { RouteDTO } from './route.dto';
import { UserDTO } from './user.dto';


/**
 * A ScheduleDTO object.
 */
export class ScheduleDTO extends BaseDTO {

            @IsNotEmpty()
            @ApiProperty({description: 'departureTime field'})
        departureTime: any;

            @IsNotEmpty()
            @ApiProperty({description: 'arrivalTime field'})
        arrivalTime: any;


        @ApiProperty({ type: () => UserDTO,description: 'shuttle relationship'})
        user: UserDTO;

        @ApiProperty({ type: () => RouteDTO,description: 'route relationship'})
        route: RouteDTO;



        

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
