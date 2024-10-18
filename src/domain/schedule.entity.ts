/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column,  ManyToOne} from 'typeorm';
import { BaseEntity } from './base/base.entity';


import { Shuttlebs } from './shuttle.entity';
import { Routebs } from './route.entity';
import { User } from './user.entity';


/**
 * A Schedulebs.
 */
@Entity('schedule')
export class Schedulebs extends BaseEntity  {


    @Column({type: 'timestamp' ,name: "departure_time"})
    departureTime: any;


    @Column({type: 'timestamp' ,name: "arrival_time"})
    arrivalTime: any;


    @ManyToOne(() =>  User)
    user: User;

    @ManyToOne(() =>  Routebs)
    route: Routebs;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
