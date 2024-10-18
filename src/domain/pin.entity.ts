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
@Entity('pin')
export class Pinbs extends BaseEntity  {
    @Column({name: "code" , nullable: true})
    code: string;

    @Column({nullable: true})
    userId: string;


    @ManyToOne(()=> User)
    @JoinColumn() 
      user?: User;
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
