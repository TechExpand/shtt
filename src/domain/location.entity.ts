/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne} from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { User } from './user.entity';




/**
 * A Pointbs.
 */
@Entity('location')
export class Locationbs extends BaseEntity  {

    @Column({type: 'decimal' ,name: "latitude"})
    latitude: number;


    @Column({type: 'decimal' ,name: "longitude"})
    longitude: number;

    @Column({type: 'integer' ,name: "userId" , nullable: true})
    userId?: number;


    @ManyToOne(() =>  User, {nullable: true})
    user?: User;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
