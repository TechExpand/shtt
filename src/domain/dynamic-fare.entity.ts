/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column,  ManyToOne} from 'typeorm';
import { BaseEntity } from './base/base.entity';


import { Routebs } from './route.entity';


/**
 * A DynamicFarebs.
 */
@Entity('dynamic_fare')
export class DynamicFarebs extends BaseEntity  {


    @Column({type: 'timestamp' ,name: "start_date"})
    startDate: any;


    @Column({type: 'timestamp' ,name: "end_date"})
    endDate: any;


    @Column({type: 'decimal' ,name: "amount", precision : 10, scale : 2})
    amount: number;


    @Column({type: 'decimal' ,name: "markup_percentage", precision : 10, scale : 2})
    markupPercentage: number;


    @ManyToOne(() =>  Routebs)
    route: Routebs;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
