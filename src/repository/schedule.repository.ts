import { EntityRepository, Repository } from 'typeorm';
import { Schedulebs } from '../domain/schedule.entity';

@EntityRepository(Schedulebs)
export class ScheduleRepository extends Repository<Schedulebs> {}
