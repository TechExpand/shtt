import { EntityRepository, Repository } from 'typeorm';
import { OperatorFarebs } from '../domain/operator-fare.entity';

@EntityRepository(OperatorFarebs)
export class OperatorFareRepository extends Repository<OperatorFarebs> {}
