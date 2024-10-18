/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne} from 'typeorm';
import { BaseEntity } from './base/base.entity';


import { Routebs } from './route.entity';
// import { Pointbs } from './stop.entity';


/**
 * A RoutePointbs.
 */
@Entity('route_stop')
export class RoutePointbs extends BaseEntity  {


    @Column({type: 'integer' ,name: "stop_order" })
    stopOrder: number;


    @Column({name: "direction" })
    direction: string;


    @ManyToOne(() => Routebs)
    route: Routebs;

    // @ManyToOne(() =>  Pointbs)
    // stop: Pointbs;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
