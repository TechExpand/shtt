/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { RouteDTO } from './route.dto';
import { PointDTO } from './point.dto';


/**
 * A RoutePointDTO object.
 */
export class OtpDTO extends BaseDTO {

            @IsNotEmpty()
            @ApiProperty({description: 'stopOrder field'})
        email: string;

            

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }




    export class VerifyDTO extends BaseDTO {

        @IsNotEmpty()
        @ApiProperty({description: 'stopOrder field'})
    serviceId: string;



    @IsNotEmpty()
    @ApiProperty({description: 'stopOrder field'})
code: number;

        

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
