import { EntityRepository, Repository } from 'typeorm';
import { CheckInbs } from '../domain/check-in.entity';

@EntityRepository(CheckInbs)
export class CheckInRepository extends Repository<CheckInbs> {}
