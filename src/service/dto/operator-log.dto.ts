/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { ShuttleOperatorDTO } from './shuttle-operator.dto';


/**
 * A OperatorLogDTO object.
 */
export class OperatorLogDTO extends BaseDTO {

            @IsNotEmpty()
            @ApiProperty({description: 'date field'})
        date: any;

            @IsNotEmpty()
            @ApiProperty({description: 'action field'})
        action: string;


        @ApiProperty({ type: () => () => () => ShuttleOperatorDTO,description: 'shuttleOperator relationship'})
        shuttleOperator: ShuttleOperatorDTO;

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
