import { EntityRepository, Repository } from 'typeorm';
import { Driverbs } from '../domain/driver.entity';

@EntityRepository(Driverbs)
export class DriverRepository extends Repository<Driverbs> {}
