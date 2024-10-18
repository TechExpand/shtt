// serviceID: String,
// code: String,


/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne} from 'typeorm';
import { BaseEntity } from './base/base.entity';


import { Ticketbs } from './ticket.entity';
import { Driverbs } from './driver.entity';
import { Schedulebs } from './schedule.entity';
import { User } from './user.entity';


/**
 * A CheckInbs.
 */
@Entity('notification')
export class Notificationbs extends BaseEntity  {


    @Column({ })
    userId?: number;
   
   @ManyToOne(()=> User)
   @JoinColumn() 
     user?: User;

    @Column({name: "message" , nullable: true})
    message: string;
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
