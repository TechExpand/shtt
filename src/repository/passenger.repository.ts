import { EntityRepository, Repository } from 'typeorm';
import { Passengerbs } from '../domain/passenger.entity';

@EntityRepository(Passengerbs)
export class PassengerRepository extends Repository<Passengerbs> {}
