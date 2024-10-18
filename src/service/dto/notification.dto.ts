/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { PaymentDTO } from './payment.dto';
import { SeatDTO } from './seat.dto';
import { PassengerDTO } from './passenger.dto';
import { ScheduleDTO } from './schedule.dto';
import { UserDTO } from './user.dto';
import { RouteDTO } from './route.dto';


/**
 * A TicketDTO object.
 */
export class NotificationDTO extends BaseDTO {
   
    
        @IsNotEmpty()
        @ApiProperty({description: 'status field'})
        message: string;


        @ApiProperty({description: 'status field'})
        userId?: number;

        @ApiProperty({ type: () =>  UserDTO, description: 'schedule relationship'})
        user?: UserDTO;

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
