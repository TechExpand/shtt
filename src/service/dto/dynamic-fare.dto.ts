/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { RouteDTO } from './route.dto';


/**
 * A DynamicFareDTO object.
 */
export class DynamicFareDTO extends BaseDTO {

            @IsNotEmpty()
            @ApiProperty({description: 'startDate field'})
        startDate: any;

            @IsNotEmpty()
            @ApiProperty({description: 'endDate field'})
        endDate: any;

            @IsNotEmpty()
            @ApiProperty({description: 'amount field'})
        amount: number;

            @IsNotEmpty()
            @ApiProperty({description: 'markupPercentage field'})
        markupPercentage: number;


        @ApiProperty({ type: () => RouteDTO,description: 'route relationship'})
        route: RouteDTO;

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
