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
export class ShuttleDTO extends BaseDTO {

    //     @IsNotEmpty()
    //     @ApiProperty({description: 'name field'})
    // name: string;

    @IsNotEmpty()
    @ApiProperty({ description: 'capacity field' })
    capacity: number;

    //     @ApiProperty({description: 'model field', required: false})
    // model: string;

    @ApiProperty({ description: 'manufacturingYear field', required: false })
    manufacturingYear: string;

    @ApiProperty({ description: 'condition field', required: false })
    model: string;

    //     @ApiProperty({description: 'isAccessible field', required: false})
    // isAccessible: boolean;


    // @ApiProperty({ type: () => UserDTO,description: 'user relationship'})
    // user: UserDTO;

    //  @ApiProperty({ type: () => SeatDTO, isArray: true,description: 'seats relationship'})
    // seats: SeatDTO;

    // @ApiProperty({ type: () => ShuttleOperatorDTO,description: 'shuttleOperator relationship'})
    // shuttleOperator: ShuttleOperatorDTO;

    // @ApiProperty({ type: () => PassengerDTO, isArray: true,description: 'passengers relationship'})
    // passengers: PassengerDTO[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
