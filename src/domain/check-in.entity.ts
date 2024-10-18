/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne} from 'typeorm';
import { BaseEntity } from './base/base.entity';


import { Ticketbs } from './ticket.entity';
import { Driverbs } from './driver.entity';
import { Schedulebs } from './schedule.entity';


/**
 * A CheckInbs.
 */
@Entity('check_in')
export class CheckInbs extends BaseEntity  {


    @Column({type: 'timestamp' ,name: "check_in_time"})
    checkInTime: any;


    @OneToOne(() =>  Ticketbs)
@JoinColumn()    ticket: Ticketbs;

    @ManyToOne(() =>  Driverbs)
    driver: Driverbs;

    @ManyToOne(() =>  Schedulebs)
    schedule: Schedulebs;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
