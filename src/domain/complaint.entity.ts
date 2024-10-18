/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne} from 'typeorm';
import { BaseEntity } from './base/base.entity';


import { Passengerbs } from './passenger.entity';


/**
 * A Complaintbs.
 */
@Entity('complaint')
export class Complaintbs extends BaseEntity  {


    @Column({type: 'timestamp' ,name: "date"})
    date: any;


    @Column({name: "description" })
    description: string;


    @Column({name: "status" })
    status: string;


    @ManyToOne(() =>  Passengerbs)
    passenger: Passengerbs;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
