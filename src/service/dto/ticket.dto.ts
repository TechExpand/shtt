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
export class TicketDTO extends BaseDTO {
   
        //     @IsNotEmpty()
        //     @ApiProperty({description: 'issuedDate field'})
        // issuedDate: string;

            @IsNotEmpty()
            @ApiProperty({description: 'ticketNumber field'})
        ticketNumber: string;



        @IsNotEmpty()
        @ApiProperty({description: 'ticketNumber field'})
    seatNumber: number;



    @IsNotEmpty()
    @ApiProperty({description: 'ticketNumber field'})
amount: number;



    points?: any[];


            @IsNotEmpty()
            @ApiProperty({description: 'status field'})
        status: string;


        @ApiProperty({description: 'status field'})
        userId?: number;



        @ApiProperty({description: 'status field'})
        routeId: number;



        @ApiProperty({description: 'status field'})
        driverId?: number;


        // @ApiProperty({ type: () => PaymentDTO,description: 'payment relationship'})
        // payment: PaymentDTO;

      


        @ApiProperty({ type: () => RouteDTO,description: 'route relationship'})
        route: RouteDTO;

        // @ApiProperty({ type: () => PassengerDTO,description: 'passenger relationship'})
        // passenger: PassengerDTO;

        // @ApiProperty({ type: () =>  ScheduleDTO,description: 'schedule relationship'})
        // schedule: ScheduleDTO;

        @ApiProperty({ type: () =>  UserDTO, description: 'schedule relationship'})
        user?: UserDTO;


        @ApiProperty({ type: () =>  UserDTO, description: 'schedule relationship'})
        driver?: UserDTO;


        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
