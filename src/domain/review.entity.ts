/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne} from 'typeorm';
import { BaseEntity } from './base/base.entity';


import { Passengerbs } from './passenger.entity';
import { Driverbs } from './driver.entity';


/**
 * A Reviewbs.
 */
@Entity('review')
export class Reviewbs extends BaseEntity  {


    @Column({type: 'bytea' ,name: "content" })
    content: any;


    @Column({type: 'integer' ,name: "rating" })
    rating: number;


    @OneToOne(() =>  Passengerbs)
@JoinColumn()    passenger: Passengerbs;

    @OneToOne(() =>  Driverbs)
@JoinColumn()    driver: Driverbs;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
