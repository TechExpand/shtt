/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable} from 'typeorm';
import { BaseEntity } from './base/base.entity';


import { Driverbs } from './driver.entity';
import { Seatbs } from './seat.entity';
import { ShuttleOperatorbs } from './shuttle-operator.entity';
import { Passengerbs } from './passenger.entity';
import { User } from './user.entity';


/**
 * A Shuttlebs.
 */
@Entity('shuttle')
export class Shuttlebs extends BaseEntity  {


    @Column({type: 'integer' ,name: "capacity" })
    capacity: number;

    @Column({type: 'integer' ,name: "manufacturing_year", nullable: true})
    manufacturingYear: string;

    @Column({name: "model", nullable: true})
    model: string;


    // @OneToOne(() => User)
    // @JoinColumn()  
    // user: User;

    // @OneToMany(() => Seatbs, other => other.shuttle)
    // seats: Seatbs[];

    // @ManyToOne(() => ShuttleOperatorbs)
    // shuttleOperator: ShuttleOperatorbs;

    // @ManyToMany(() => Passengerbs )
    // @JoinTable({
    //     name: 'rel_shuttle__passenger',
    //     joinColumn: { name: 'shuttle_id', referencedColumnName: "id" },
    //     inverseJoinColumn: { name: 'passenger_id', referencedColumnName: "id" }
    // })
    // passengers: Passengerbs[];

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
