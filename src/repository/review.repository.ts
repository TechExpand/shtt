import { EntityRepository, Repository } from 'typeorm';
import { Reviewbs } from '../domain/review.entity';

@EntityRepository(Reviewbs)
export class ReviewRepository extends Repository<Reviewbs> {}
