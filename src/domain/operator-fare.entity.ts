/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne} from 'typeorm';
import { BaseEntity } from './base/base.entity';


import { Routebs } from './route.entity';
import { ShuttleOperatorbs } from './shuttle-operator.entity';


/**
 * A OperatorFarebs.
 */
@Entity('operator_fare')
export class OperatorFarebs extends BaseEntity  {


    @Column({type: 'timestamp' ,name: "start_date"})
    startDate: any;


    @Column({type: 'timestamp' ,name: "end_date"})
    endDate: any;


    @Column({type: 'decimal' ,name: "amount", precision : 10, scale : 2})
    amount: number;


    @ManyToOne(() =>  Routebs)
    route: Routebs;

    @ManyToOne(() =>  ShuttleOperatorbs)
    shuttleOperator: ShuttleOperatorbs;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
