/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { TicketDTO } from './ticket.dto';
import { DriverDTO } from './driver.dto';
import { ScheduleDTO } from './schedule.dto';


/**
 * A CheckInDTO object.
 */
export class CheckInDTO extends BaseDTO {

            @IsNotEmpty()
            @ApiProperty({description: 'checkInTime field'})
        checkInTime: any;


        @ApiProperty({ type: () => TicketDTO,description: 'ticket relationship'})
        ticket: TicketDTO;

        @ApiProperty({ type: () => DriverDTO,description: 'driver relationship'})
        driver: DriverDTO;

        @ApiProperty({ type: () => ScheduleDTO,description: 'schedule relationship'})
        schedule: ScheduleDTO;

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
