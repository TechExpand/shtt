/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, JoinTable, ManyToMany} from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { User } from './user.entity';
import { Pointbs } from './point.entity';




/**
 * A Routebs.
 */
@Entity('route')
export class Routebs extends BaseEntity  {


    @Column({type: 'integer' , name: "distance" })
    distance: number;


    @Column({type: 'decimal' ,name: "pickupLan" })
    pickupLan: any;

    @Column({type: 'decimal' ,name: "pickupLog" })
    pickupLog: any;



    @Column({type: 'decimal' ,name: "dropoffLan" })
    dropoffLan: any;

    @Column({type: 'decimal' ,name: "dropoffLog" })
    dropoffLog: any;


    @Column({name: "dropoffLocation" , nullable: true})
    dropoffLocation: string;



    @Column({name: "date" , nullable: true})
    date: string;



    @Column({name: "time" , nullable: true})
    time: string;



    @Column({name: "price" , nullable: true})
    price: number;



    @Column({name: "maximumSeat" , nullable: true, default: 0})
    maximumSeat: number;



    @Column({name: "nextAvailableSeat" , nullable: true, default: 1})
    nextAvailableSeat: number;




    @Column("int", {array: true,  name: "bookedSits" , nullable: true, default: []})
    bookedSits: number[];



    @Column("int",{array: true, name: "resheduledSits" , nullable: true, default: []})
    resheduledSits: number[];


    @Column({name: "pickupLocation" , nullable: true})
    pickupLocation: string;



    @Column({name: "status" , nullable: true, default:"BOOKED"})
    status?: string;


    @ManyToMany(() => Pointbs)
    @JoinTable()
    points?: any[];
    // @Column( {nullable: true})
    // type: string;



    @Column({type: 'integer' ,name: "userId" , nullable: true})
    userId: number;


    @ManyToOne(() =>  User, {nullable: true})
    user: User;
    
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
