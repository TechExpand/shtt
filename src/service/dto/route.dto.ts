/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';
import { UserDTO } from './user.dto';




/**
 * A RouteDTO object.
 */
export class RouteDTO extends BaseDTO {

        @IsNotEmpty()
        @ApiProperty({description: 'distance field'})
        distance: any;


        @ApiProperty({description: 'distance field'})
        pickupLan: any;

        @ApiProperty({description: 'distance field'})
        pickupLog: any;



        @ApiProperty({description: 'distance field'})
        dropoffLan: any;

        @ApiProperty({description: 'distance field'})
        dropoffLog: any;



        @ApiProperty({description: 'distance field'})
        price: number;



        @ApiProperty({description: 'distance field'})
        maximumSeat: number;



        @ApiProperty({description: 'distance field'})
        nextAvailableSeat: number; 

        

        @ApiProperty({description: 'distance field'})
        date: string;



        @ApiProperty({description: 'distance field'})
        resheduledSits: number[];



        @ApiProperty({description: 'distance field'})
        bookedSits: number[];


        @ApiProperty({description: 'distance field'})
        status?: string;


        @ApiProperty({description: 'distance field'})
        time: string;

        
        @ApiProperty({description: 'distance field'})
        pickupLocation: string;


        @ApiProperty({description: 'distance field'})
        dropoffLocation: string;



        @ApiProperty({description: 'distance field'})
        userId: number;



        @ApiProperty({ type: () => UserDTO, description: 'shuttle role'})
        user: UserDTO;


        points?: any[];



        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
