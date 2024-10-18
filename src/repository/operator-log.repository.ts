import { EntityRepository, Repository } from 'typeorm';
import { OperatorLogbs } from '../domain/operator-log.entity';

@EntityRepository(OperatorLogbs)
export class OperatorLogRepository extends Repository<OperatorLogbs> {}
