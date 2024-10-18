import { EntityRepository, Repository } from 'typeorm';
import { Complaintbs } from '../domain/complaint.entity';

@EntityRepository(Complaintbs)
export class ComplaintRepository extends Repository<Complaintbs> {}
