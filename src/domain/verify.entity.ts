// serviceID: String,
// code: String,


/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne} from 'typeorm';
import { BaseEntity } from './base/base.entity';


import { Ticketbs } from './ticket.entity';
import { Driverbs } from './driver.entity';
import { Schedulebs } from './schedule.entity';


/**
 * A CheckInbs.
 */
@Entity('verify')
export class Verifybs extends BaseEntity  {


    @Column({name: "serviceId" , nullable: true})
    serviceId: string;

    @Column({name: "code" , nullable: true})
    code: string;
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
