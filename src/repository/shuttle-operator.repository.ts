import { EntityRepository, Repository } from 'typeorm';
import { ShuttleOperatorbs } from '../domain/shuttle-operator.entity';

@EntityRepository(ShuttleOperatorbs)
export class ShuttleOperatorRepository extends Repository<ShuttleOperatorbs> {}
