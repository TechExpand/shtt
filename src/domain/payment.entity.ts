/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column} from 'typeorm';
import { BaseEntity } from './base/base.entity';




/**
 * A Paymentbs.
 */
@Entity('payment')
export class Paymentbs extends BaseEntity  {


    @Column({type: 'decimal' ,name: "amount", precision : 10, scale : 2})
    amount: number;


    @Column({type: 'timestamp' ,name: "payment_date"})
    paymentDate: any;


    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
