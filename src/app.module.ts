import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './module/auth.module';
import { ormConfig } from './orm.config';
import { ShuttleModule } from './module/shuttle.module';
import { PassengerModule } from './module/passenger.module';
import { StopModule } from './module/point.module';
import { RouteModule } from './module/route.module';
import { ScheduleModule } from './module/schedule.module';
// import { RouteStopModule } from './module/route-stop.module';
import { ReviewModule } from './module/review.module';
import { DriverModule } from './module/driver.module';
import { PaymentModule } from './module/payment.module';
import { TicketModule } from './module/ticket.module';
import { CheckInModule } from './module/check-in.module';
import { SeatModule } from './module/seat.module';
import { ShuttleOperatorModule } from './module/shuttle-operator.module';
import { ComplaintModule } from './module/complaint.module';
import { OperatorLogModule } from './module/operator-log.module';
import { OperatorFareModule } from './module/operator-fare.module';
import { DynamicFareModule } from './module/dynamic-fare.module';
import { RoleModule } from './module/role.module';
// jhipster-needle-add-entity-module-to-main-import - JHipster will import entity modules here, do not remove
// jhipster-needle-add-controller-module-to-main-import - JHipster will import controller modules here, do not remove
// jhipster-needle-add-service-module-to-main-import - JHipster will import service modules here, do not remove

@Module({
  imports: [
  TypeOrmModule.forRootAsync({ useFactory: ormConfig }),
    AuthModule,
  ShuttleModule,
  PassengerModule,
  StopModule,
  RouteModule,
  ScheduleModule,
  // RouteStopModule,
  RoleModule,
  ReviewModule,
  DriverModule,
  PaymentModule,
  TicketModule,
  CheckInModule,
  SeatModule,
  ShuttleOperatorModule,
  ComplaintModule,
  OperatorLogModule,
  OperatorFareModule,
  DynamicFareModule,
  // jhipster-needle-add-entity-module-to-main - JHipster will add entity modules here, do not remove
  ],
  controllers: [
  // jhipster-needle-add-controller-module-to-main - JHipster will add controller modules here, do not remove
  ],
  providers: [
  // jhipster-needle-add-service-module-to-main - JHipster will add service modules here, do not remove
  ],
})
export class AppModule  {

}
