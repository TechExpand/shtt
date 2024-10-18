/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, JoinTable, ManyToMany} from 'typeorm';
import { BaseEntity } from './base/base.entity';


import { Routebs } from './route.entity';
// import { Pointbs } from './stop.entity';
import { User } from './user.entity';


/**
 * A RoutePointbs.
 */
@Entity('role')
export class Rolebs extends BaseEntity  {


    @Column({name: "title" })
    title: string;

    // @ManyToMany(() => User, (user)=>user.role)
    // @JoinTable()
    // user: User[];

    // @ManyToOne(() => User)
    // user: User;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
