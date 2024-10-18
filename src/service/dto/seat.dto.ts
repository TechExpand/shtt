/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, MaxLength, Length, Min, Max, Matches } from 'class-validator';
import { BaseDTO } from './base.dto';


import { ShuttleDTO } from './shuttle.dto';
import { UserDTO } from './user.dto';


/**
 * A SeatDTO object.
 */
export class SeatDTO extends BaseDTO {

            @IsNotEmpty()
            @ApiProperty({description: 'row field'})
            sitNumber: number;


            @ApiProperty({description: 'row field'})
            driverId: number;


            @ApiProperty({description: 'row field'})
            userId: number;


        @ApiProperty({ type: () => UserDTO,description: 'shuttle relationship'})
        driver: UserDTO;


        @ApiProperty({ type: () => UserDTO,description: 'shuttle relationship'})
        user: UserDTO;


        // @Column({type: 'integer' })
        // sitNumber: number;
    
    
        // @ManyToOne(() =>  User)
        // driver: User;
    
    
        // @ManyToOne(() =>  User)
        // user: User;
    

        // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

    }
