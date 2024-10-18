/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, JoinColumn, OneToOne, ManyToOne, OneToMany, ManyToMany, JoinTable} from 'typeorm';
import { BaseEntity } from './base/base.entity';


import { Paymentbs } from './payment.entity';
import { Seatbs } from './seat.entity';
import { Passengerbs } from './passenger.entity';
import { Schedulebs } from './schedule.entity';
import { User } from './user.entity';
import { Routebs } from './route.entity';
import { Pointbs } from './point.entity';


/**
 * A Ticketbs.
 */
@Entity('ticket')
export class Ticketbs extends BaseEntity  {


    // @Column({name: "issued_date"})
    // issuedDate: string;


    @Column({name: "ticket_number" })
    ticketNumber: string;



    @Column({name: "seat_number" })
    seatNumber: number;


    @Column({name: "status" , default:null})
    status: string;



 @Column({ })
 userId?: number;

@ManyToOne(()=> User)
@JoinColumn() 
  user?: User;



  @Column({ nullable: true})
  driverId?: number;



  @Column({ nullable: true})
  routeId: number;




  @Column({ nullable: true})
  amount: number;





  @ManyToMany(() => Pointbs)
  @JoinTable()
  points?: any[];
  // @Column( {nullable: true})
  // type: string;
 


 @ManyToOne(()=> User)
 @JoinColumn() 
   driver?: User;


//     @ManyToOne(() => Seatbs)
// @JoinColumn()    seat: Seatbs;



@ManyToOne(() =>  Routebs, {nullable: true})
route: Routebs;

//     @ManyToOne(() => Passengerbs)
//     passenger: Passengerbs;

    // @ManyToOne(() => Schedulebs)
    // schedule: Schedulebs;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove

}
