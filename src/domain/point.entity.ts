/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column} from 'typeorm';
import { BaseEntity } from './base/base.entity';




/**
 * A Pointbs.
 */
@Entity('point')
export class Pointbs extends BaseEntity  {


    @Column({type: 'decimal' ,name: "latitude", precision : 10, scale : 2})
    latitude: any;


    @Column({type: 'decimal' ,name: "longitude", precision : 10, scale : 2})
    longitude: any;


    @Column({type: 'decimal' ,name: "routeId", nullable: true})
    routeId?: number;
    

    @Column({name: "address", nullable: true})
    address: string;


    @Column({name: "type", nullable: true})
    type: string;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
