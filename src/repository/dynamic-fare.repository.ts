import { EntityRepository, Repository } from 'typeorm';
import { DynamicFarebs } from '../domain/dynamic-fare.entity';

@EntityRepository(DynamicFarebs)
export class DynamicFareRepository extends Repository<DynamicFarebs> {}
