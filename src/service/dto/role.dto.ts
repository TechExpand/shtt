/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { PassengerDTO } from './passenger.dto';
import { DriverDTO } from './driver.dto';


/**
 * A ReviewDTO object.
 */
export class RoleDTO extends BaseDTO {

            
            @ApiProperty({description: 'content field'})
        title: any;

           

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
