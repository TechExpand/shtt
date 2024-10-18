/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { RouteDTO } from './route.dto';
import { PointDTO } from './point.dto';


/**
 * A RoutePointDTO object.
 */
export class RoutePointDTO extends BaseDTO {

            @IsNotEmpty()
            @ApiProperty({description: 'stopOrder field'})
        stopOrder: number;

            @IsNotEmpty()
            @ApiProperty({description: 'direction field'})
        direction: string;


        @ApiProperty({ type: () => RouteDTO,description: 'route relationship'})
        route: RouteDTO;

        @ApiProperty({ type: () => PointDTO,description: 'stop relationship'})
        stop: PointDTO;

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
