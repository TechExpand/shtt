/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToMany} from 'typeorm';
import { BaseEntity } from './base/base.entity';


import { Shuttlebs } from './shuttle.entity';


/**
 * A Passengerbs.
 */
@Entity('passenger')
export class Passengerbs extends BaseEntity  {


    @Column({name: "name" })
    name: string;


    @Column({name: "email" })
    email: string;

    @Column({type: 'date' ,name: "date_of_birth", nullable: true})
    dateOfBirth: any;

    @Column({name: "phone_number", nullable: true})
    phoneNumber: string;

    @Column({name: "address", nullable: true})
    address: string;


    @ManyToMany(() =>  Shuttlebs )
    shuttles: Shuttlebs[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
