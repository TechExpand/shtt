/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne} from 'typeorm';
import { BaseEntity } from './base/base.entity';


import { Shuttlebs } from './shuttle.entity';
import { User } from './user.entity';


/**
 * A Seatbs.
 */
@Entity('seat')
export class Seatbs extends BaseEntity  {


    @Column({type: 'integer' })
    sitNumber: number;



    @Column({type: 'integer' })
    driverId: number;



    @Column({type: 'integer' })
    userId: number;


    @ManyToOne(() =>  User)
    driver: User;


    @ManyToOne(() =>  User)
    user: User;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
