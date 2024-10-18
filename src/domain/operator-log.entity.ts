/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne} from 'typeorm';
import { BaseEntity } from './base/base.entity';


import { ShuttleOperatorbs } from './shuttle-operator.entity';


/**
 * A OperatorLogbs.
 */
@Entity('operator_log')
export class OperatorLogbs extends BaseEntity  {


    @Column({type: 'timestamp' ,name: "date"})
    date: any;


    @Column({name: "action" })
    action: string;


    @ManyToOne(() =>  ShuttleOperatorbs)
    shuttleOperator: ShuttleOperatorbs;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
