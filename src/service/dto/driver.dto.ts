/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';




/**
 * A DriverDTO object.
 */
export class DriverDTO extends BaseDTO {

            @IsNotEmpty()
            @ApiProperty({description: 'name field'})
        name: string;

            @IsNotEmpty()
            @ApiProperty({description: 'licenseNumber field'})
        licenseNumber: string;


        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
